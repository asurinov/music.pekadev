module App {
    angular.module('app')
      .constant('stringDictionaries', {
          'pages': ['страница', 'страницы', 'страниц'],
          'records': ['запись', 'записи', 'записей']
      })
        .constant('VK', window['VK'])
        .constant('Howler', window['Howler'])
        .constant('Howl', window['Howl'])
        .constant('VK_API_VERSION', '5.53')
        .constant('VK_CLIENT_ID', 5130198);
}