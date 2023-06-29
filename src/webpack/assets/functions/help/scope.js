export async function scope(
  id,
  erro,
  status,
  text = null,
  type = null,
  body = null
) {
  let e = {
    to: id,
    error: erro,
    text: text,
    status: status,
    type: type,
    body: body,
  };
  return e;
}
