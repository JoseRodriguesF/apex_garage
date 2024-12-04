// Inicializa o Flatpickr para o campo de Data
flatpickr("#data", {
  dateFormat: "Y-m-d",  // Formato compatível com o banco de dados
  minDate: "today",     // Impede a seleção de datas passadas
  locale: "pt"          // Define o idioma para português
});

// Inicializa o Flatpickr para o campo de Hora
flatpickr("#hora", {
  enableTime: true,         // Ativa o seletor de hora
  noCalendar: true,         // Desativa o calendário, deixando apenas a seleção de hora
  time_24hr: true,          // Exibe hora no formato 24h
  dateFormat: "H:i",        // Formato compatível com o banco de dados
  locale: "pt"              // Define o idioma para português
});