<template>
  <footer class="footer">
    <p class="footer__logo">0x<span>Studios</span></p>
    <p>Copyright 0xStudio, 2019-{{ new Date().getFullYear() }}</p>
    <p class="footer__links"><a href="#">CGU</a> - <a href="#">Legal Notice</a></p>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 2px solid #bdbdbd;
  padding: 2.5rem 1rem 3rem;
  text-align: center;
  font-family: var(--font-small);
  font-size: 1.05rem;
}

.footer__logo {
  font-family: var(--font-pixel);
  font-size: 2.6rem;
  line-height: 0.85;
  margin-bottom: 0.9rem;
}

.footer__logo span {
  display: block;
  font-size: 1.15rem;
  line-height: 1;
}

.footer__links {
  color: var(--muted);
}
</style>
