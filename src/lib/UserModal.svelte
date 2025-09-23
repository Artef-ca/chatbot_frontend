<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
  email,
    emailSet,
    newApiRequest,
    setEmail,
    setFavoriteModal,
    showFavoriteModal,
  } from "../Functions.svelte";
  import { authService } from "./auth/authStore";
  import LoginButton from "./components/LoginButton.svelte";
  import { isAuthenticated } from "./auth/stores";
  import UserProfile from "./components/UserProfile.svelte";
  let ENABLED: boolean;

  onMount(async () => {
    await authService.initialize();
  });


  emailSet.subscribe((data) => {
    console.log("modal open : ",data.enabled);
    ENABLED = data.enabled;
  });

  let dialog: any; // HTMLDialogElement
  let title: string = "";
  let password: string = "";
  let errorMsg: string = "";

  function onSubmit(){
    if (title != "") {
      if(title == 'thelinecrm3.0@neom.com' && password == '^7V*2sIgsxOSnhMMdS'){
        setEmail(title, password);
        dialog.close();
      }
      else {
      errorMsg = "Email or password is incorrect";
    }
  
    } else {
      errorMsg = "Email or password is required";
    }
  }
 
  interface UserProfile {
    displayName: string;
    userPrincipalName: string;
    [key: string]: any;
  }
  
  let userProfile: UserProfile | null = null;
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
      console.log('USERLOGIN',{userProfile}, new Date())
      newApiRequest('login','POST',{}).then(data=>{
        console.log(data)
      })
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // localStorage.removeItem("user_email");
      await authService.logout()
      emailSet.set({
              enabled: true,
            });
      ENABLED=true
            
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      onSubmit();
      event.preventDefault(); // prevent any default action
    }
  } 

  function preventEscapeClose(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault(); // prevent closing dialog on Escape key
    }
  }

  // Watch for dialog open state
  $: if (dialog && ENABLED) {
    dialog.showModal();
    document.addEventListener("keydown", preventEscapeClose);
  } else {
    document.removeEventListener("keydown", preventEscapeClose);
  }

  $: if ($isAuthenticated) {
    console.log("User authenticated! Fetching profile...");
    ENABLED = false;
    // dialog.close();
    fetchUserProfile()
  }else{
    ENABLED=true
  }
</script>

<dialog
  bind:this={dialog}
  on:close={() => {
    ENABLED = false;
    setFavoriteModal(false, null);
  }}
>

  <!-- <LoginButton /> -->

</dialog>

<style>
  dialog {
    width: 20rem;
    max-width: 32em;
    border-radius: 0.2em;
    border: none;
    padding: 1rem;
    background: var(--primary);
    color: var(--text-color);
    border-radius: 1rem;
  }
  dialog::backdrop {
    background: white;
  }
  dialog > div {
    padding: 1em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }
  .input {
    color: white;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }
  input,
  select {
    background-color: var(--primary-light);
    padding: 15px;
    padding-right: 0.5rem;
    padding-top: 15px;
    margin: 5px 0;
    border: none;
    resize: none;
    height: 3rem;
    font-size: 0.8rem;
    color: var(--text-color);
    scrollbar-color: transparent transparent;
  }
  button {
    color: var(--text-color);
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;
    background-color: var(--primary-light);
    margin: auto;
    margin-top: 1rem;
    display: block;
    font-size: 0.8rem;
  }
</style>
