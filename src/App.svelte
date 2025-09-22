<script>
  import { Router, Route } from 'svelte-routing';
  import MainPage from './routes/MainPage.svelte';
  import UserProfile from './lib/components/UserProfile.svelte';
</script>

<Router>
  <Route path="/" component={MainPage} />
  <Route path="/redirect" component={UserProfile} />
</Router>