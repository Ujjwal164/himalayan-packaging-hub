<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Use the shared StoreProvider around route content for quote state and global request dialogs, so all pages share a single quote session.
- Keep catalog data in a static typed frontend module and quote state in React memory; ordering hands off to WhatsApp and does not claim to save or submit requests on a server.
- Keep business WhatsApp recipient explicitly unset until a real number is provided; never route customer inquiries to an invented recipient.
- Keep individual content pages in TanStack file routes with per-page metadata for shareable catalog, policy and contact URLs.
