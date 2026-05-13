# pyrefly: ignore [missing-import]
from django.contrib import admin
# pyrefly: ignore [missing-import]
from django.urls import path, include
# pyrefly: ignore [missing-import]
from django.conf import settings
# pyrefly: ignore [missing-import]
from django.conf.urls.static import static
# pyrefly: ignore [missing-import]
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
# pyrefly: ignore [missing-import]
from django.shortcuts import redirect
# pyrefly: ignore [missing-import]
from django.http import HttpResponse

def health_check(request):
    return HttpResponse("Synapse AI SaaS Running 🚀")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("api.v1.urls")),
    path('api/health/', health_check),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
