const linguagemTabela = {
  sEmptyTable: "Nenhum registro encontrado",
  sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
  sInfoEmpty: "Mostrando 0 até 0 de 0 registros",
  sInfoFiltered: "(Filtrados de _MAX_ registros)",
  sInfoPostFix: "",
  sInfoThousands: ".",
  sLengthMenu: "_MENU_ resultados por página",
  sLoadingRecords: "Carregando...",
  sProcessing: "Processando...",
  sZeroRecords: "Nenhum registro encontrado",
  sSearch: "Pesquisar:",
  oPaginate: {
      sNext: "Próximo",
      sPrevious: "Anterior",
      sFirst: "Primeiro",
      sLast: "Último"
  },
  oAria: {
      sSortAscending: ": Ordenar colunas de forma ascendente",
      sSortDescending: ": Ordenar colunas de forma descendente"
  }
}

export const environment = {
  production: true,
  urlApiUsuarios: "https://api-ps.vemprafam.com.br/fam.login/api",
  urlApiPsel: "https://api-ps.vemprafam.com.br/fam.processoseletivo/api",
  urlAPIInsc: "https://api-ps.vemprafam.com.br/fam.inscricao/api",
  urlApiIngresso: 'https://api-ps.vemprafam.com.br/fam.ingresso/api',
  urlApiLead: "https://api-ps.vemprafam.com.br/fam.lead/api",
  urlApiCRM:  "https://api-ps.vemprafam.com.br/fam.crmmkt/api",

  pagamento: {
    qtdMaxParcelas: 4,
    valorMinParcela: 100
  },
  tableOptions: {
    bLengthChange: false,
    pagingType: "full_numbers",
    responsive: true,
    paging: true,
    ordering: true,
    info: false,
    pageLength: 10,
    language: linguagemTabela,
    classes: {
      sPageButton: ''
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
