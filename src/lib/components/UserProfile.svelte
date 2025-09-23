<script lang="ts">
  import { onMount } from 'svelte';
  import { account, isAuthenticated } from '../auth/stores';
  import { authService } from '../auth/authStore';
  import { setEmail } from '../../Functions.svelte';
  
  interface UserProfile {
    displayName: string;
    userPrincipalName: string;
    [key: string]: any;
  }
  
  let userProfile: UserProfile | null = null;
  let error: Error | null = null;

  onMount(async()=>{
    await fetchUserProfile()
  })

  async function fetchUserProfile() {
    try {
      const token = await authService.getAccessToken();
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      userProfile = await response.json();
      setEmail(userProfile?.mail, userProfile?.id);
      console.log({userProfile})
    } catch (err) {
      error = err as Error;
      console.error('Error fetching user profile:', err);
    }
  }

  console.log("line 36 account info : ",$account,$isAuthenticated)

</script>

<div class="profile-container">
  {#if userProfile}
    <h2>Welcome, {userProfile.displayName}!</h2>
    <p>Email: {userProfile.userPrincipalName}</p>
  {:else if error}
    <p class="error">Error loading profile: {error.message}</p>
  {:else if $account}
    <p>Loading profile...</p>
  {/if}
</div>

<style>
  .profile-container {
    padding: 1rem;
  }
  
  .error {
    color: red;
  }
</style>
