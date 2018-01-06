      <app-message-modal></app-message-modal>
      <app-petty-cash-modal :store="store" :transaction="store.pettyCashTransaction" :modal-mode="store.pettyCashMode" @save="saveTransaction"></app-petty-cash-modal>
      <app-ticket-modal></app-ticket-modal>
      <iframe src="" frameborder="0" name="printframe" width="100%" class="hide"></iframe>
    </main>
    <div class="splash-screen">
      <img class="splash-logo" src="{url}assets/img/icpayment_logo_alter.svg" alt="">
      <h1>IC Payment</h1>
    </div>
    <script>
      const baseURL = '{url}'
      const Company = '{company}'
      const CurrentUser= '{currentUser}'
    </script>
    {js}
      <script src="{link}"></script>
    {/js}

    <script>
      if (!/[localhost]||[staging]/.test(window.location.origin)) {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-97873154-2', 'auto');
        ga('send', 'pageview');
      }
    </script>
 </body>
</html>
