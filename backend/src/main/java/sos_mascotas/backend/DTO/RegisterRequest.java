package sos_mascotas.backend.DTO;

import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
    @NotBlank String email,
    @NotBlank String password,
    @NotBlank String nombre,
    @NotBlank String telefono
) {}
