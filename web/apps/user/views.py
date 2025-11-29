from rest_framework import views, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
User = get_user_model()


# -----------------------------------------------------
# 🟢 REGISTRO DE USUARIO
# -----------------------------------------------------

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username", "").strip()
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()

        # Validaciones básicas
        if not username or not email or not password:
            return Response(
                {"error": "Todos los campos son obligatorios (username, email, password)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Email repetido
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "El correo ya está registrado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Username repetido
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "El nombre de usuario ya está en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validación de seguridad de contraseña
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({"error": list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

        # Crear usuario
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        return Response(
            {"success": True, "message": "Usuario registrado correctamente."},
            status=status.HTTP_201_CREATED,
        )
# -----------------------------------------------------
# 🟢 LOGIN + TOKEN JWT
# -----------------------------------------------------
class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "username y password son requeridos"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {"error": "Credenciales inválidas"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # 🔥 Creamos JWT tokens para el usuario
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_staff": user.is_staff,
                },
            },
            status=status.HTTP_200_OK,
        )


# -----------------------------------------------------
# 🟢 PERFIL / USUARIO ACTUAL (requier JWT)
# -----------------------------------------------------
class MeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
            },
            status=status.HTTP_200_OK,
        )
