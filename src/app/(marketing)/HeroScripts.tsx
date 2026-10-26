"use client";

import { useEffect } from "react";

export default function HeroScripts() {
  useEffect(() => {
    function U(i: any) {
      const {
        canvas: e,
        imageSrc: g,
        blockSize: a = 8,
        pixelsPerFrame: d = 120,
        glitchRegion: h = 0.36,
        delay: b = 200,
        onComplete: r,
      } = i;
      const l = e.getContext("2d");
      const t = e.width;
      const o = e.height;
      let v = 0, w: any;
      const u = new Image();
      u.crossOrigin = "anonymous";
      u.src = g;
      u.onload = () => {
        const y = document.createElement("canvas");
        y.width = t;
        y.height = o;
        const B = y.getContext("2d")!;
        B.drawImage(u, 0, 0, t, o);
        const s = B.getImageData(0, 0, t, o);
        const m = Math.ceil(t / a);
        const c = Math.ceil(o / a);
        const x: number[] = [];
        for (let f = 0; f < c; f++) {
          for (let p = 0; p < m; p++) {
            const R = Math.min(p * a + Math.floor(a / 2), t - 1);
            const n = Math.min(f * a + Math.floor(a / 2), o - 1);
            if (s.data[(n * t + R) * 4 + 3] > 20) {
              x.push(f * m + p);
            }
          }
        }
        for (let f = x.length - 1; f > 0; f--) {
          const p = Math.floor(Math.random() * (f + 1));
          [x[f], x[p]] = [x[p], x[f]];
        }
        let I = 0,
          T = 0,
          E = 0,
          O = 0;
        function k(f: number) {
          if (!I) I = f;
          const p = (f - I) / 1000;
          if (E === 0) {
            const R = Math.min(T + d, x.length);
            for (let n = T; n < R; n++) {
              const M = x[n];
              const P = M % m;
              const F = Math.floor(M / m);
              const A = Math.min(P * a + Math.floor(a / 2), t - 1);
              const _ = (Math.min(F * a + Math.floor(a / 2), o - 1) * t + A) * 4;
              l.fillStyle = `rgba(${s.data[_]},${s.data[_ + 1]},${s.data[_ + 2]},${s.data[_ + 3] / 255})`;
              l.fillRect(P * a, F * a, a, a);
            }
            T = R;
            if (T >= x.length) {
              E = 1;
              O = p;
            }
          } else if (E === 1) {
            const R = Math.min(1, (p - O) / 1.5);
            const n = Math.max(1, Math.floor(a * (1 - R)));
            const M = o * h;
            l.clearRect(0, 0, t, o);
            l.drawImage(u, 0, M, t, o - M, 0, M, t, o - M);
            const P = Math.ceil(t / n);
            const F = Math.ceil(M / n);
            for (let A = 0; A < F; A++) {
              for (let S = 0; S < P; S++) {
                const _ = Math.min(S * n + Math.floor(n / 2), t - 1);
                const L = (Math.min(A * n + Math.floor(n / 2), o - 1) * t + _) * 4;
                if (s.data[L + 3] < 20) continue;
                let q = 0;
                if (Math.random() < 0.05 * (1 - R)) {
                  q = (Math.random() - 0.5) * 24 * (1 - R);
                }
                l.fillStyle = `rgba(${s.data[L]},${s.data[L + 1]},${s.data[L + 2]},${s.data[L + 3] / 255})`;
                l.fillRect(S * n + q, A * n, n, n);
              }
            }
            if (R >= 1) E = 2;
          } else {
            l.clearRect(0, 0, t, o);
            l.drawImage(u, 0, 0, t, o);
            r?.();
            return;
          }
          v = requestAnimationFrame(k);
        }
        w = setTimeout(() => {
          v = requestAnimationFrame(k);
        }, b);
      };
      return () => {
        cancelAnimationFrame(v);
        clearTimeout(w);
      };
    }

    function $() {
      const i = document.querySelector("[data-hands-stage]");
      const e = document.querySelector("[data-hands-fast]") as HTMLVideoElement;
      const g = document.querySelector("[data-hands-slow]") as HTMLVideoElement;
      if (!i || !e || !g) return;
      const a = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!a) {
        e.setAttribute("data-faded", "true");
        g.setAttribute("data-faded", "true");
        g.playbackRate = 1;
        g.play().catch(() => {});
      }
      if (a) return;
      const d = { x: 0, y: 0 };
      const h = { x: 0, y: 0 };
      function b(t: MouseEvent) {
        const o = i!.getBoundingClientRect();
        d.x = (t.clientX - o.left) / o.width - 0.5;
        d.y = (t.clientY - o.top) / o.height - 0.5;
      }
      function r() {
        d.x = 0;
        d.y = 0;
      }
      function l() {
        h.x += (d.x - h.x) * 0.04;
        h.y += (d.y - h.y) * 0.04;
        const t = h.x * 12;
        const o = h.y * 8;
        const v = `translate(${t}px, ${o}px)`;
        e.style.transform = v;
        g.style.transform = v;
        requestAnimationFrame(l);
      }
      i.addEventListener("mousemove", b as EventListener);
      i.addEventListener("mouseleave", r);
      requestAnimationFrame(l);
    }

    function z() {
      const i = document.getElementById("headline-brain-canvas") as HTMLCanvasElement;
      if (i) {
        U({
          canvas: i,
          imageSrc: "/Supermemory_files/brain-head_fIE5.webp",
          glitchRegion: 0.36,
        });
      }
    }

    function D() {
      const i = document.querySelector("[data-hero-dots]") as HTMLCanvasElement;
      if (!i) return;
      const e = i.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
      });
      if (!e) return;
      const g = `
        attribute vec2 a_pos;
        void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
      `;
      const a = `
        precision highp float;
        uniform vec2 u_res;
        uniform float u_cell;
        uniform vec3 u_color;
        uniform float u_alpha;

        // Bayer 8x8 ordered-dither threshold map, normalized to [0..1).
        float bayer(vec2 p){
          int x = int(mod(p.x, 8.0));
          int y = int(mod(p.y, 8.0));
          int i = y * 8 + x;
          // Standard 8x8 Bayer matrix values (0..63)
          int v;
          if(i==0) v=0;   else if(i==1) v=32;  else if(i==2) v=8;   else if(i==3) v=40;
          else if(i==4) v=2;   else if(i==5) v=34;  else if(i==6) v=10;  else if(i==7) v=42;
          else if(i==8) v=48;  else if(i==9) v=16;  else if(i==10) v=56; else if(i==11) v=24;
          else if(i==12) v=50; else if(i==13) v=18; else if(i==14) v=58; else if(i==15) v=26;
          else if(i==16) v=12; else if(i==17) v=44; else if(i==18) v=4;  else if(i==19) v=36;
          else if(i==20) v=14; else if(i==21) v=46; else if(i==22) v=6;  else if(i==23) v=38;
          else if(i==24) v=60; else if(i==25) v=28; else if(i==26) v=52; else if(i==27) v=20;
          else if(i==28) v=62; else if(i==29) v=30; else if(i==30) v=54; else if(i==31) v=22;
          else if(i==32) v=3;  else if(i==33) v=35; else if(i==34) v=11; else if(i==35) v=43;
          else if(i==36) v=1;  else if(i==37) v=33; else if(i==38) v=9;  else if(i==39) v=41;
          else if(i==40) v=51; else if(i==41) v=19; else if(i==42) v=59; else if(i==43) v=27;
          else if(i==44) v=49; else if(i==45) v=17; else if(i==46) v=57; else if(i==47) v=25;
          else if(i==48) v=15; else if(i==49) v=47; else if(i==50) v=7;  else if(i==51) v=39;
          else if(i==52) v=13; else if(i==53) v=45; else if(i==54) v=5;  else if(i==55) v=37;
          else if(i==56) v=63; else if(i==57) v=31; else if(i==58) v=55; else if(i==59) v=23;
          else if(i==60) v=61; else if(i==61) v=29; else if(i==62) v=53; else v=21;
          return float(v) / 64.0;
        }

        void main(){
          // Pixel coords with origin top-left.
          vec2 px = gl_FragCoord.xy;
          px.y = u_res.y - px.y;
          // Normalized 0..1 across the hero.
          vec2 uv = px / u_res;

          // Cell coords — one Bayer threshold per cell, so dots quantize to a grid.
          vec2 cell = floor(px / u_cell);
          float t = bayer(cell);

          // Two intensity fields anchored at the BOTTOM CORNERS reach higher
          // up the sides. A third low-amplitude field hugs the bottom-center
          // so a sparse scatter sits behind the CTAs without overwhelming the
          // text. Combined via max.
          vec2 cL = vec2(-0.05, 1.1);
          vec2 cR = vec2( 1.05, 1.1);
          vec2 scale = vec2(0.35, 0.65);
          float rL = length((uv - cL) / scale);
          float rR = length((uv - cR) / scale);
          float pL = 1.0 - smoothstep(0.3, 1.05, rL);
          float pR = 1.0 - smoothstep(0.3, 1.05, rR);

          vec2 cC = vec2(0.5, 1.2);
          float rC = length((uv - cC) / vec2(0.8, 0.55));
          float pC = (1.0 - smoothstep(0.2, 1.0, rC)) * 0.35;

          float p = max(max(pL, pR), pC);

          if (p <= t) discard;

          vec2 cellPx = mod(px, u_cell) - u_cell * 0.5;
          float dist = length(cellPx);
          float dotR = u_cell * 0.28;
          float aa = 1.0 - smoothstep(dotR - 0.5, dotR + 0.5, dist);
          if (aa <= 0.0) discard;

          gl_FragColor = vec4(u_color, aa * u_alpha);
        }
      `;
      function d(s: any, m: any) {
        const c = e!.createShader(s);
        if (!c) return null;
        e!.shaderSource(c, m);
        e!.compileShader(c);
        if (e!.getShaderParameter(c, e!.COMPILE_STATUS)) return c;
        console.warn("Hero dots shader error:", e!.getShaderInfoLog(c));
        e!.deleteShader(c);
        return null;
      }
      const h = d(e.VERTEX_SHADER, g);
      const b = d(e.FRAGMENT_SHADER, a);
      if (!h || !b) return;
      const r = e.createProgram();
      if (!r) return;
      e.attachShader(r, h);
      e.attachShader(r, b);
      e.linkProgram(r);
      if (!e.getProgramParameter(r, e.LINK_STATUS)) {
        console.warn("Hero dots link error:", e.getProgramInfoLog(r));
        return;
      }
      e.useProgram(r);
      const l = e.createBuffer();
      e.bindBuffer(e.ARRAY_BUFFER, l);
      e.bufferData(
        e.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        e.STATIC_DRAW
      );
      const t = e.getAttribLocation(r, "a_pos");
      e.enableVertexAttribArray(t);
      e.vertexAttribPointer(t, 2, e.FLOAT, false, 0, 0);
      const o = e.getUniformLocation(r, "u_res");
      const v = e.getUniformLocation(r, "u_cell");
      const w = e.getUniformLocation(r, "u_color");
      const u = e.getUniformLocation(r, "u_alpha");
      e.enable(e.BLEND);
      e.blendFunc(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA);
      function y() {
        const s = Math.min(window.devicePixelRatio || 1, 2);
        const m = Math.max(1, Math.floor(i.clientWidth * s));
        const c = Math.max(1, Math.floor(i.clientHeight * s));
        if (i.width !== m || i.height !== c) {
          i.width = m;
          i.height = c;
          e!.viewport(0, 0, m, c);
        }
        e!.uniform2f(o, m, c);
        e!.uniform1f(v, 6 * s);
        e!.uniform3f(w, 5 / 255, 98 / 255, 239 / 255);
        e!.uniform1f(u, 0.6);
        e!.clearColor(0, 0, 0, 0);
        e!.clear(e!.COLOR_BUFFER_BIT);
        e!.drawArrays(e!.TRIANGLES, 0, 6);
      }
      y();
      const ro = new ResizeObserver(y);
      ro.observe(i);
      window.addEventListener("resize", y);

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", y);
      }
    }

    function O(e: any) {
      if (e.__pxInit) return;
      e.__pxInit = true;
      const t = (e.dataset.colors || "#ffffff").split(",").map((i: any) => i.trim());
      const n = parseInt(e.dataset.gap || "6", 10);
      const p = parseInt(e.dataset.speed || "28", 10);
      const l = e.dataset.trigger || "";
      const u = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      function D(e1: any, t1: any) { return e1 <= 0 || t1 ? 0 : e1 >= 100 ? 100 * 0.001 : e1 * 0.001; }
      const S = D(p, u);
      const h = e.getContext("2d");
      if (!h) return;
      let a: any[] = [];
      let g = 0;
      let I = performance.now();
      const y = 1e3 / 60;
      class P {
        width: any; height: any; ctx: any; x: any; y: any; color: any; speed: any; size: any; sizeStep: any; minSize: any; maxSizeInteger: any; maxSize: any; delay: any; counter: any; counterStep: any; isIdle: any; isReverse: any; isShimmer: any;
        constructor(t2: any, n2: any, p2: any, l2: any, u2: any, S2: any, h2: any, a2 = 1) {
          this.width = t2.width; this.height = t2.height; this.ctx = n2; this.x = p2; this.y = l2; this.color = u2;
          this.speed = this.rand(0.1, 0.9) * S2; this.size = 0; this.sizeStep = Math.random() * 0.4 * a2;
          this.minSize = 0.5 * a2; this.maxSizeInteger = 2; this.maxSize = this.rand(this.minSize, this.maxSizeInteger) * a2;
          this.delay = h2; this.counter = 0; this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
          this.isIdle = false; this.isReverse = false; this.isShimmer = false;
        }
        rand(t3: any, n3: any) { return Math.random() * (n3 - t3) + t3; }
        draw() {
          const t4 = this.maxSizeInteger * 0.5 - this.size * 0.5;
          this.ctx.fillStyle = this.color;
          this.ctx.fillRect(this.x + t4, this.y + t4, this.size, this.size);
        }
        appear() {
          if (this.isIdle = false, this.counter <= this.delay) { this.counter += this.counterStep; return; }
          if (this.size >= this.maxSize) (this.isShimmer = true);
          this.isShimmer ? this.shimmer() : this.size += this.sizeStep;
          this.draw();
        }
        disappear() {
          if (this.isShimmer = false, this.counter = 0, this.size <= 0) { this.isIdle = true; return; }
          this.size -= 0.1;
          this.draw();
        }
        shimmer() {
          if (this.size >= this.maxSize) this.isReverse = true;
          else if (this.size <= this.minSize) (this.isReverse = false);
          this.isReverse ? this.size -= this.speed : this.size += this.speed;
        }
      }
      function E() {
        const i = e.parentElement;
        if (!i) return;
        const c = i.getBoundingClientRect();
        const s = Math.floor(c.width);
        const r = Math.floor(c.height);
        const o = Math.min(window.devicePixelRatio || 1, 2);
        e.width = s * o; e.height = r * o; e.style.width = `${s}px`; e.style.height = `${r}px`; h.scale(o, o);
        e.style.position = 'absolute';
        e.style.top = '0';
        e.style.left = '0';
        e.style.transform = 'none';
        const C = { width: s, height: r };
        const R = [];
        const L = 140;
        const F = 1.8;
        for (let f = 0; f < s; f += n) {
          for (let m = 0; m < r; m += n) {
            const z = Math.min(f, m, s - f, r - m);
            if (z > L) continue;
            const T = 1 - z / L;
            const b = Math.pow(T, F);
            if (b < 0.1) continue;
            const _ = t[Math.floor(Math.random() * t.length)];
            const q = u ? 0 : z * 3;
            R.push(new P(C, h, f, m, _, S, q, b));
          }
        }
        a = R;
      }
      function M(i: any) {
        g = requestAnimationFrame(() => M(i));
        const c = performance.now();
        const s = c - I;
        if (s < y) return;
        I = c - (s % y);
        h.clearRect(0, 0, e.width, e.height);
        let r = true;
        for (const o of a) {
          o[i]();
          if (!o.isIdle) (r = false);
        }
        if (r) cancelAnimationFrame(g);
      }
      function x(i: any) {
        cancelAnimationFrame(g);
        g = requestAnimationFrame(() => M(i));
      }
      E();
      const A = new ResizeObserver(E);
      if (e.parentElement) A.observe(e.parentElement);
      const d = l ? e.closest(l) : e.parentElement;
      if (d) {
        d.addEventListener("mouseenter", () => x("appear"));
        d.addEventListener("mouseleave", () => x("disappear"));
        d.addEventListener("focusin", () => x("appear"));
        d.addEventListener("focusout", (i: any) => { if (!d.contains(i.relatedTarget)) x("disappear") });
      }
    }
    
    function w() {
      document.querySelectorAll("[data-pixel-canvas]").forEach(O);
    }

    function initCatalog() {
      const r = document.querySelector("[data-catalog]");
      if (!r) return;
      const d = Number((r as HTMLElement).dataset.interval) || 5e3,
        s = Array.from(r.querySelectorAll("[data-card]")),
        g = Array.from(r.querySelectorAll("[data-text-card]")),
        l = Array.from(r.querySelectorAll("[data-spine-btn]")),
        c = Array.from(r.querySelectorAll("[data-progress-fill]")) as HTMLElement[];
      if (s.length === 0 || l.length !== s.length) return;
      const u = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let i = 0,
        n: any = null,
        a = false;
      function f(e: number, t: any = {}) {
        if (e === i) return;
        const o = i;
        s[o]?.setAttribute("aria-hidden", "true");
        g[o]?.setAttribute("aria-hidden", "true");
        l[o]?.setAttribute("aria-current", "false");
        i = e;
        s[i]?.setAttribute("aria-hidden", "false");
        g[i]?.setAttribute("aria-hidden", "false");
        l[i]?.setAttribute("aria-current", "true");
        A();
        if (t.resetTimer !== false) h();
      }
      function A() {
        c.forEach((t) => {
          t.style.transition = "none";
          t.style.width = "0%";
        });
        (r as HTMLElement).offsetHeight; // trigger reflow
        const e = c[i];
        if (e && !u) {
          e.style.transition = `width ${d}ms linear`;
          e.style.width = "100%";
        }
      }
      function h() {
        if (n) clearTimeout(n);
        if (!u && !a) {
          n = setTimeout(() => {
            f((i + 1) % s.length);
          }, d);
        }
      }
      function m() {
        if (a) return;
        a = true;
        if (n) {
          clearTimeout(n);
          n = null;
        }
        const e = c[i];
        if (e) {
          const t = getComputedStyle(e).width;
          e.style.transition = "none";
          e.style.width = t;
        }
      }
      function y() {
        if (!a || ((a = false), u)) return;
        const e = c[i];
        if (e) {
          const t = e.parentElement?.getBoundingClientRect().width || 1,
            o = parseFloat(getComputedStyle(e).width) || 0,
            E = Math.min(1, o / t),
            b = Math.max(200, d * (1 - E));
          e.style.transition = `width ${b}ms linear`;
          e.style.width = "100%";
          if (n) clearTimeout(n);
          n = setTimeout(() => f((i + 1) % s.length), b);
        } else {
          h();
        }
      }
      l.forEach((e) => {
        e.addEventListener("click", () => {
          const t = Number((e as HTMLElement).dataset.index || 0);
          f(t);
        });
        e.addEventListener("focus", m);
        e.addEventListener("blur", y);
      });
      const v = r.querySelector(".catalog-spine-list");
      if (v) {
        v.addEventListener("mouseenter", m);
        v.addEventListener("mouseleave", y);
      }
      document.addEventListener("visibilitychange", () => {
        document.hidden ? m() : y();
      });
      const p = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            A();
            h();
            p.disconnect();
          }
        });
      }, { threshold: 0.25 });
      p.observe(r);
    }

    $();
    z();
    w();
    
    function initFaq() {
      const rows = document.querySelectorAll("[data-faq-row]");
      const triggers = document.querySelectorAll("[data-faq-trigger]");

      triggers.forEach((trigger, index) => {
        trigger.addEventListener("click", () => {
          const row = trigger.closest("[data-faq-row]");
          if (!row) return;
          const isOpen = row.getAttribute("data-open") === "true";
          
          // Close all
          rows.forEach((r) => {
            r.setAttribute("data-open", "false");
            const btn = r.querySelector("[data-faq-trigger]");
            if (btn) btn.setAttribute("aria-expanded", "false");
          });
          
          // Open clicked one if it was closed
          if (!isOpen) {
            row.setAttribute("data-open", "true");
            trigger.setAttribute("aria-expanded", "true");
          }
        });
      });
    }

    initCatalog();
    initFaq();
    const cleanupD = D();

    return () => {
        if(cleanupD) cleanupD();
    }
  }, []);

  return null;
}
