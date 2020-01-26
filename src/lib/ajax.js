/**
 *
 */
export default function(url, method = 'get', params) {
  switch (method.toLocaleUpperCase()) {
    case 'POST':
      return save(url, 'POST', params);

    case 'PUT':
      return save(url, 'PUT', params);

    case 'PATCH':
      return save(url, 'PATCH', params);

    case 'DELETE':
      return fetch(url, { method: 'DELETE' });

    case 'GET':
    default:
      return fetch(url).then(response => response.json());
  }
}

export function save(url, method, params) {
  return fetch(url, {
    method: method,
    body: JSON.stringify(params),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  }).then(response => response.json());
}
