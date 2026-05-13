# AWS EC2 Deployment Guide (Step-by-Step)

This guide will take you from a brand new AWS EC2 instance to a fully running application.

## Step 1: Open Ports in AWS (Security Groups)
Before we connect, we need to tell AWS to allow internet traffic to our server.

1. Go to your AWS EC2 Dashboard.
2. On the left menu, click **Instances**.
3. Click on the ID of your running instance (e.g., `i-0abcdef1234567890`).
4. Look at the bottom half of the screen and click the **Security** tab.
5. Click on the link under **Security groups** (it looks like `sg-0abcd1234...`).
6. Click the **Edit inbound rules** button on the right.
7. Click **Add rule** 3 times to add these three rules:
   * **Rule 1:** Type: `HTTP`, Source: `Anywhere-IPv4`
   * **Rule 2:** Type: `HTTPS`, Source: `Anywhere-IPv4`
   * **Rule 3:** Type: `Custom TCP`, Port Range: `8080`, Source: `Anywhere-IPv4`
8. Click **Save rules** at the bottom.

## Step 2: Prepare your `.pem` key
When you created the EC2 instance, you downloaded a `.pem` file (e.g., `my-key.pem`). 

1. Find where this `.pem` file is on your computer (usually in the `Downloads` folder).
2. Open **PowerShell** on your computer.
3. Navigate to the folder where your `.pem` file is. For example, if it's in Downloads, type:
   ```powershell
   cd C:\Users\acer\Downloads
   ```

## Step 3: Connect to your Server (SSH)
Now we will log into the AWS server from your computer.

1. In the AWS Dashboard, click on your instance and look for the **Public IPv4 address** (e.g., `3.85.12.34`). Copy it.
2. In your PowerShell window, type the following command (replace `my-key.pem` with your actual key name, and `IP_ADDRESS` with the copied IP):
   ```powershell
   ssh -i "my-key.pem" ubuntu@IP_ADDRESS
   ```
   *(Note: If you chose Amazon Linux instead of Ubuntu when creating the server, use `ec2-user@IP_ADDRESS` instead of `ubuntu@IP_ADDRESS`)*
3. It will ask: `Are you sure you want to continue connecting (yes/no/[fingerprint])?`. Type **yes** and hit Enter.
4. You are now inside your server! The prompt should look like `ubuntu@ip-172-31-xx-xx:~$`.

## Step 4: Install Docker on the Server
Now that you are inside the server, copy and paste these commands one by one, hitting Enter after each:

```bash
# Update the server
sudo apt update

# Install Docker and Docker Compose
sudo apt install docker.io docker-compose -y

# Give your user permission to use Docker
sudo usermod -aG docker $USER
```
**CRITICAL:** After running the last command, type `exit` and hit Enter. This will kick you out of the server. 
Now, press the `Up Arrow` key to bring back your `ssh` command and hit Enter to **log back in**. (This applies the Docker permissions).

## Step 5: Send your project files to the Server
Keep your current PowerShell window open (logged into the server). 
Now, open a **NEW** PowerShell window on your computer. We will use this new window to copy the files from your computer to the server.

1. In the **NEW** PowerShell window, navigate to your project folder:
   ```powershell
   cd C:\Users\acer\Downloads
   ```
2. Run this command to copy your entire `project-management` folder to the server. (Replace `my-key.pem` and `IP_ADDRESS`):
   ```powershell
   scp -i "my-key.pem" -r project-management ubuntu@IP_ADDRESS:/home/ubuntu/
   ```
3. Wait for the upload to finish (it might take a few minutes).

## Step 6: Start the Application!
Go back to your **FIRST** PowerShell window (the one logged into the server).

1. Go into the project folder that you just uploaded:
   ```bash
   cd project-management
   ```
2. Create your environment file:
   ```bash
   cp .env.example .env
   ```
3. Start everything using Docker:
   ```bash
   docker-compose up --build -d
   ```
4. Wait for it to finish building and starting. 

## Step 7: Setup the Database
Once it says "Started", we need to setup the database tables and create an admin user. Run these:

1. Create the database tables:
   ```bash
   docker-compose exec backend python manage.py migrate
   ```
2. Create an admin account (it will ask for username, email, and password):
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

## Step 8: View your Website!
Open your web browser (Chrome/Edge) and type your server's IP address with port 8080:
`http://IP_ADDRESS:8080`

You should see your project running live on the internet!
