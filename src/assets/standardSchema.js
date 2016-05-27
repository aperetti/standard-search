export const schema = {
  'title': 'Add/Edit Standard',
  'type': 'object',
  'properties': {
    'code': {
      'type': 'string',
      'title': 'Standard Code'
    },
    'desc': {
      'type': 'string',
      'title': 'Standard Description'
    },
    'menu': {
      'type': 'array',
      'format': 'table',
      'title': 'Categories',
      'items': {
        'type': 'string',
        'title': 'Menu'
      }
    },
    'standardRefs': {
      'type': 'array',
      'format': 'table',
      'title': 'References',
      'uniqueItems': true,
      'items': {
        'type': 'object',
        'properties': {
          'standardType': {
            'title': 'Standard Type',
            'type': 'string'
          },
          'references': {
            'type': 'array',
            'format': 'table',
            'title': 'Standards',
            'uniqueItems': true,
            'items': {
              'title': 'Standards',
              'type': 'string'
            }
          }
        }
      }
    }
  }
}
