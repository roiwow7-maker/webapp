from django.contrib import admin
from .models import (
    Brand,
    Category,
    Product,
    ProductVariant,
    ProductImage,
    Model3DAsset,
)

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "site")
    search_fields = ("name", "slug")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "parent")
    search_fields = ("name", "slug")
    list_filter = ("parent",)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


class Model3DInline(admin.TabularInline):
    model = Model3DAsset
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "sku_root", "brand", "category", "condition", "grade", "publish")
    list_filter = ("brand", "category", "condition", "grade", "publish")
    search_fields = ("title", "sku_root", "short_desc", "long_desc")
    inlines = [ProductVariantInline, ProductImageInline, Model3DInline]
