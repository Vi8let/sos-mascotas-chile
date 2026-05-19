package sos_mascotas.report_service.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import sos_mascotas.report_service.model.TipoReporte;

public record CreateReportRequest(
        @NotBlank String titulo,
        @NotNull TipoReporte tipo,
        @NotBlank String descripcion,
        String ubicacion,
        String imagenUrl,
        @NotBlank String contacto) {
}
