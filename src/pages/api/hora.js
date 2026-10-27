export async function GET() {
    const fecha = new Date().toLocaleString("es-Es")
    return new Response(
        JSON.stringify({
            lafecha: fecha,
            msg: "Hola"
        }),
        {headers: {"Content-Type":"application/json"}}
    )
}