<script lang="ts">
  import { authService } from "../auth/authStore";
  import { isAuthenticated } from "../auth/stores";


  async function handleLogin() {
    try {
      await authService.login();
    } catch (err) {
      console.error('Login failed:', err);
    }
  }

  async function handleLogout() {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }
  console.log("line 21 in login button",$isAuthenticated)
</script>

<div class="login-container">
  <img class="h-auto mb-9" src="/groqlogo.png" alt="Logo" />
  {#if $isAuthenticated}
    <button on:click={handleLogout}>Logout</button>
  {:else}
  <button
  on:click={handleLogin}
  class="flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-black rounded-md px-6 py-3 w-full max-w-[320px] font-medium shadow-sm transition-all duration-200 hover:shadow"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
    <path fill="#F25022" d="M1 1h9v9H1z"/>
    <path fill="#00A4EF" d="M1 11h9v9H1z"/>
    <path fill="#7FBA00" d="M11 1h9v9h-9z"/>
    <path fill="#FFB900" d="M11 11h9v9h-9z"/>
  </svg>
  <span class="text-gray-700">Sign in with SSO</span>
</button>
    <!-- <button on:click={handleLogin}>Login with Microsoft</button> -->
  {/if}
</div>

<style>
  .login-container {
    padding: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #f0f0f0;
  }
</style>
