/**
 * WS - Global WebSocket Manager
 * Handles project-specific and notification channels with auto-reconnect.
 */
const WS = {
    sockets: new Map(), // path -> socket
    handlers: new Map(), // path -> Set of handlers

    connect(path, handlers) {
        if (this.sockets.has(path)) {
            const s = this.sockets.get(path);
            if (s.readyState === WebSocket.OPEN || s.readyState === WebSocket.CONNECTING) {
                // If already connecting/open, just add the new handlers if they are different
                if (handlers) {
                    const existing = this.handlers.get(path) || new Set();
                    existing.add(handlers);
                    this.handlers.set(path, existing);
                }
                return s;
            }
        }

        const token = localStorage.getItem("access");
        let wsHost = location.host;
        let protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
        
        const apiBase = window.API?.API_BASE;
        if (apiBase && apiBase.startsWith('http')) {
            const apiURL = new URL(apiBase);
            wsHost = apiURL.host;
            protocol = apiURL.protocol === 'https:' ? 'wss:' : 'ws:';
        }
        
        const url = `${protocol}//${wsHost}${path}?token=${token}`;
        
        const socket = new WebSocket(url);
        this.sockets.set(path, socket);
        
        if (handlers) {
            const set = this.handlers.get(path) || new Set();
            set.add(handlers);
            this.handlers.set(path, set);
        }

        socket.onopen = () => console.log(`[WS OPEN] ${path}`);
        
        socket.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                const handlersSet = this.handlers.get(path);
                if (handlersSet) {
                    handlersSet.forEach(h => {
                        if (typeof h === 'function') h(msg);
                        else if (h[msg.type]) h[msg.type](msg.data);
                    });
                }
            } catch (err) {
                console.error("[WS MSG ERROR]", err);
            }
        };

        socket.onclose = () => {
            console.log(`[WS CLOSE] ${path}`);
            this.sockets.delete(path);
            setTimeout(() => this.connect(path), 3000);
        };

        socket.onerror = (err) => {
            console.error(`[WS ERROR] ${path}`, err);
            socket.close();
        };

        return socket;
    },

    connectNotifications(handler) {
        return this.connect('/ws/notifications/', handler);
    },

    connectProject(projectId, handlers) {
        return this.connect(`/ws/projects/${projectId}/`, handlers);
    }
};

window.WS = WS;
console.log("[WS] Manager initialized");