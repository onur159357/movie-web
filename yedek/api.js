const call = async (method, url, body, contentType) => {
    const params = {
        method: method.toUpperCase(),
        headers: {
            Accept: 'application/json',
            'Content-Type': contentType || 'application/json',
        }
    };

    if (body) {
        params.body = JSON.stringify(body);
    }

    const res = await fetch(`${url}`, params);
    const json = await res.json();

    if (res.code && res.code !== 200) {
        throw res.description || res.message;
    }

    if (json.code) {
        throw json.message;
    }

    return json;
};