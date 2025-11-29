from rest_framework.routers import DefaultRouter
from .views import BrandViewSet, CategoryViewSet, ProductViewSet, ManagementReportViewSet
from django.urls import path
router = DefaultRouter()
router.register(r"brands", BrandViewSet)
router.register(r"categories", CategoryViewSet)
router.register(r"products", ProductViewSet)
router.register(r"management-report", ManagementReportViewSet, basename="management-report")

urlpatterns = router.urls
