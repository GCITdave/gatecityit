export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();
  
  return new Response(
    `<script>
      window.opener.postMessage(
        'authorization:github:success:${JSON.stringify(data)}',
        '*'
      );
    </script>`,
    { headers: { "Content-Type": "text/html" } }
  );
}