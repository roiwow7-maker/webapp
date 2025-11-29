from rest_framework import serializers
from .models import (
    Brand,
    Category,
    Product,
    ProductVariant,
    ProductImage,
    Model3DAsset,
)


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt", "sort"]


class Model3DAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model3DAsset
        fields = ["id", "file", "preview_image", "notes"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "sku", "attributes", "price_clp", "stock", "weight_g"]


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    models3d = Model3DAssetSerializer(many=True, read_only=True)
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "sku_root",
            "title",
            "brand",
            "category",
            "short_desc",
            "long_desc",
            "condition",
            "grade",
            "publish",
            "variants",
            "images",
            "models3d",
        ]
