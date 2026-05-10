package sos_mascotas.backend.DTO;

public record AuthResponse(
    String token,
    String email,
    String role
) {}
