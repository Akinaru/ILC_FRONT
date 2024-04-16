export async function request(method, object, url, data = null) {
    const requestOptions = {
        method: method,
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: data ? JSON.stringify(data) : null
    };

    const response = await fetch(url, requestOptions);
    object.value = await response.json();
}
