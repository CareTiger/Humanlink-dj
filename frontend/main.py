import os

import flask as f
import requests

from util import is_localhost


def run(debug=True, backend=os.environ['BACKEND']):
    app = f.Flask(__name__)
    app.config['DEBUG'] = debug
    app.config['BACKEND'] = backend
    app.template_folder = 'views'
    _setup_jinja(app)
    return app


def _setup_jinja(app):
    params = dict(app.jinja_options)
    params.update({
        'block_start_string': '[%',
        'block_end_string': '%]',
        'variable_start_string': '[=',
        'variable_end_string': '=]',
    })
    app.jinja_options = params



app = run(debug=is_localhost())

@app.route('/_debug_toolbar/<path:url>')
def ignore(url):
    f.abort(404)


@app.route('/')
@app.route('/<path:url>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def proxy(url=''):
    """Proxy between this app and the backend."""
    url = app.config['BACKEND'] + '/' + url

    headers = {}
    for h in f.request.headers.keys():
        headers[h] = f.request.headers[h]
    try:
        data = f.request.data or f.request.form
        if f.request.method == 'POST':
            r = requests.post(url, data=data, headers=headers,
                              allow_redirects=False)
        elif f.request.method == 'PUT':
            r = requests.put(url, data=data, headers=headers,
                             allow_redirects=False)
        else:
            r = requests.get(url, params=f.request.args, headers=headers,
                             allow_redirects=False)
        # Dirty solution for handling redirects.
        if 301 <= r.status_code <= 302 and 'location' in r.headers:
            r.headers['location'] = r.headers['location'].replace(
                'localhost/', headers['Host'] + '/')
        return build_response(r)
    except Exception as e:
        return str(e)


def build_response(res):
    r = f.Response(response=res.text, status=res.status_code,
                   headers=res.headers.items())
    # See: https://github.com/kennethreitz/requests/issues/2890
    r.headers.pop('set-cookie', None)
    for c in res.raw.headers.getlist('set-cookie'):
        r.headers.add('set-cookie', c)
    return r
