1.Supabase configuration and table setup
Go to https://supabase.com and create a project.

*Create a table named leagues with the following fields:
league
text
country
leadingTeam
seeMoreLink

*Enable Row Level Security (RLS) and add the insert policy.
2.How React-Query is used
React Query is used to cache and manage league data.
-Wrapped in <QueryClientProvider> in _layout.tsx:
<QueryClientProvider client={queryClient}> 
  {/* App content */} 
</QueryClientProvider>


-On adding a new league (AddLeagueForm.tsx):
queryClient.invalidateQueries(['leagues']);
This refreshes the league list after a new item is added.

-Cached data is preloaded on app start (preloadLeagues.ts):
queryClient.setQueryData(['leagues'], JSON.parse(cached));

How AsyncStorage is implemented
AsyncStorage is used to store Supabase sessions automatically and cache league data locally for faster loading.

 
A. file utils/supabase.ts
When the Supabase client is initialized, AsyncStorage is passed to the auth.storage option:const storage = isReactNative ? AsyncStorage : undefined;
// ...
auth: {
storage, // Use AsyncStorage for React Native
// ...
}, 
B.File: app/hooks/useGetLeague.ts

Implementation for Caching:

Saving to Cache: Inside the queryFn of the useGetLeagues hook, after successfully fetching league data from Supabase, the data is stringified and saved to AsyncStorage:await AsyncStorage.setItem(LEAGUE_CACHE_KEY, JSON.stringify(data)); 

C.File: app/utils/preloadLeague.ts

Implementation: This file contains a preloadLeagues function that can be used to proactively load data from AsyncStorage and populate the React Query cache using queryClient.setQueryData(['leagues'], JSON.parse(cached)). 
