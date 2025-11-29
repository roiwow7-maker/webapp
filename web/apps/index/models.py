from django.db import models
from django.utils.translation import gettext_lazy as _


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Brand(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True)
    site = models.URLField(blank=True)

    class Meta:
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Category(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="children",
    )

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
    def __str__(self):
        return self.name


class Condition(models.TextChoices):
    NEW = "NEW", _("Nuevo")
    USED = "USED", _("Usado")
    REFURB = "REFURB", _("Refurbished")


class Grade(models.TextChoices):
    A = "A", "A"
    B = "B", "B"
    C = "C", "C"


class Product(TimeStampedModel):
    sku_root = models.CharField("SKU base", max_length=50, unique=True)
    title = models.CharField("Título", max_length=200)
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT)
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )
    short_desc = models.CharField("Descripción corta", max_length=500, blank=True)
    long_desc = models.TextField("Descripción larga", blank=True)
    condition = models.CharField(
        max_length=6,
        choices=Condition.choices,
        default=Condition.USED,
    )
    grade = models.CharField(
        max_length=1,
        choices=Grade.choices,
        default=Grade.B,
    )
    publish = models.BooleanField("Publicado", default=True)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return f"{self.title} ({self.sku_root})"


class ProductVariant(TimeStampedModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants",
    )
    sku = models.CharField(max_length=60, unique=True)
    attributes = models.JSONField(default=dict, blank=True)
    price_clp = models.PositiveIntegerField("Precio CLP")
    stock = models.PositiveIntegerField(default=0)
    weight_g = models.PositiveIntegerField("Peso (g)", default=0)

    class Meta:
        verbose_name = "Variante de producto"
        verbose_name_plural = "Variantes de producto"

    def __str__(self):
        return f"{self.product.title} - {self.sku}"


class ProductImage(TimeStampedModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(upload_to="products/images/")
    alt = models.CharField(max_length=200, blank=True)
    sort = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Imagen de producto"
    def __str__(self):
        return f"Imagen {self.product.title}"


class Model3DAsset(TimeStampedModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="models3d",
    )
    file = models.FileField(upload_to="products/3d/")  # .glb / .gltf
    preview_image = models.ImageField(
        upload_to="products/3d/previews/",
        blank=True,
    )
    notes = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "Modelo 3D"
        verbose_name_plural = "Modelos 3D"

    def __str__(self):
        return f"3D {self.product.title}"
