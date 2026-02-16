export default {
  async fetch(request, env, ctx) {
    return new Response("Backend is running!", { status: 200 });
  }
};