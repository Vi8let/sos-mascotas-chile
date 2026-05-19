package sos_mascotas.report_service.DTO;

import java.time.LocalDateTime;

import sos_mascotas.report_service.model.EstadoReporte;
import sos_mascotas.report_service.model.TipoReporte;

public record ReportResponse(
        Long id,
        String titulo,
        TipoReporte tipo,
        EstadoReporte estado,
        String descripcion,
        String ubicacion,
        String imagenUrl,
        String contacto,
        String autorNombre,
        LocalDateTime creadoEn) {
}
