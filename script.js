$(document).ready(function(){
    // Inicializar el calendario
    $('#startDate').datepicker({
        format: "dd/mm/yyyy",
        language: "es",
        todayHighlight: true,
        autoclose: true
    });

    // Escuchar el cambio en el menú desplegable del período de tiempo
    document.getElementById('timePeriod').addEventListener('change', function() {
        let periodDetailLabel = document.querySelector('#periodDetail label');
        let periodDetailUnit = this.value === 'meses' ? 'Mes(es)' : 'Día(s)';
        periodDetailLabel.innerText = `Cantidad de ${periodDetailUnit}`;
    });

    // Escuchar el evento input para el valor inicial
    document.getElementById('initialValue').addEventListener('input', function() {
        let inputValue = parseFloat(this.value.replace(/\./g, '').replace(',', '.'));
        if (!isNaN(inputValue)) {
            this.value = inputValue.toLocaleString('es-CO');
        }
    });

    // Función para convertir meses a días
    function convertMonthsToDays(months) {
        let totalDays = 0;
        let currentMonth = new Date().getMonth(); // Mes actual (0-11)
        let currentYear = new Date().getFullYear(); // Año actual
        for (let i = 0; i < months; i++) {
            let month = (currentMonth + i) % 12; // Calcula el mes (0-11)
            let year = currentYear + Math.floor((currentMonth + i) / 12); // Calcula el año
            // Determinar los días en el mes actual
            let daysInMonth = new Date(year, month + 1, 0).getDate();
            totalDays += daysInMonth;
        }
        return totalDays;
    }

    // Escuchar el cambio en el campo de cantidad de meses
    document.getElementById('periodDetailInput').addEventListener('input', function() {
        let months = parseInt(this.value);
        let days = convertMonthsToDays(months);
        document.getElementById('convertedDays').innerText = `${days} Día(s)`;
    });

    // Escuchar el envío del formulario
    document.getElementById('projectionForm').addEventListener('submit', function(e) {
        e.preventDefault();

        let initialValue = parseFloat(document.getElementById('initialValue').value.replace(/\./g, '').replace(',', '.'));
        let timePeriod = document.getElementById('timePeriod').value;
        let periodDetail = parseInt(document.getElementById('periodDetailInput').value);
        let results = document.getElementById('results');
        results.innerHTML = '';

        // Función para calcular la proyección simple
        function calculateProjection(value, period, detail) {
            if (period === 'meses') {
                let totalDays = convertMonthsToDays(detail);
                return value * totalDays;
            } else {
                let totalPeriods = period === 'meses' ? detail :
                                  period === 'anios' ? detail * 12 : detail; // Asumiendo 12 meses por año
                return value * totalPeriods;
            }
        }

        // Calcular los valores proyectados
        let projectionValue = calculateProjection(initialValue, timePeriod, periodDetail);

        // Mostrar los resultados en la tabla
        let resultHTML = `
            <tr>
                <td>${periodDetail} ${timePeriod}</td>
                <td>${projectionValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
            </tr>
        `;

        results.innerHTML = resultHTML;

        // Actualizar la fecha de inicio
        let startDate = new Date();
        let formattedStartDate = startDate.toLocaleDateString('es-ES');
        document.getElementById('startDate').value = formattedStartDate;
    });

    // Escuchar el click en el botón de reiniciar
    document.getElementById('resetButton').addEventListener('click', function() {
        document.getElementById('projectionForm').reset();
        document.getElementById('results').innerHTML = '';
    });
});
