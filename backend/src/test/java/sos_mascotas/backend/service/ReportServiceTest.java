package sos_mascotas.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import sos_mascotas.backend.DTO.CreateReportRequest;
import sos_mascotas.backend.DTO.UserInfoResponse;
import sos_mascotas.backend.config.UserServiceClient;
import sos_mascotas.backend.model.Report;
import sos_mascotas.backend.model.TipoReporte;
import sos_mascotas.backend.repository.ReportRepository;

class ReportServiceTest {

    private final ReportRepository reportRepository = org.mockito.Mockito.mock(ReportRepository.class);
    private final UserServiceClient userServiceClient = org.mockito.Mockito.mock(UserServiceClient.class);
    private final ReportService reportService = new ReportService(reportRepository, userServiceClient);

    @Test
    void createAssignsAuthenticatedUserAsAuthor() {
        var request = new CreateReportRequest(
                "Mascota perdida",
                TipoReporte.ANIMAL_PERDIDO,
                "Perro visto cerca de la plaza",
                "Santiago",
                null,
                "+56912345678");

        when(userServiceClient.validateToken("Bearer token"))
                .thenReturn(new UserInfoResponse(7L, "persona@test.cl", "Persona", "ROLE_USER"));
        when(reportRepository.save(any(Report.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = reportService.create("Bearer token", request);

        ArgumentCaptor<Report> captor = ArgumentCaptor.forClass(Report.class);
        verify(reportRepository).save(captor.capture());

        assertThat(captor.getValue().getAutorId()).isEqualTo(7L);
        assertThat(response.titulo()).isEqualTo("Mascota perdida");
        assertThat(response.autorNombre()).isEqualTo("usuario-7");
    }
}
