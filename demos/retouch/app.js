const zh = {
  ccdName: "\u767d\u76ae CCD",
  ccdNote: "\u767d\u3001\u96fe\u3001\u95ea",
  cleanName: "\u771f\u5b9e\u51c0\u80a4",
  cleanNote: "\u4fee\u7455\u3001\u4fdd\u80a4\u8272",
  creamName: "\u751c\u59b9\u5976\u6cb9",
  creamNote: "\u8f6f\u5149\u3001\u7c89\u80a4",
  koreanName: "\u6e05\u51b7\u97e9\u7cfb",
  koreanNote: "\u4f4e\u9971\u548c\u3001\u51b7\u767d",
  filmName: "\u590d\u53e4\u80f6\u7247",
  filmNote: "\u6696\u7070\u3001\u9897\u7c92",
  dailyName: "\u65e5\u6742\u6c27\u6c14",
  dailyNote: "\u5e72\u51c0\u3001\u901a\u900f",
  y3kName: "Y3K \u95ea\u5149",
  y3kNote: "\u9510\u3001\u51b7\u3001\u4eae",
  spicyName: "\u6d53\u989c\u8fa3\u59b9",
  spicyNote: "\u9ad8\u5bf9\u6bd4\u3001\u7ea2\u5507",
  nightName: "\u591c\u666f\u6c1b\u56f4",
  nightNote: "\u9713\u8679\u3001\u6697\u89d2"
};

const styles = [
  { id: "clean", name: zh.cleanName, note: zh.cleanNote, swatches: ["#f1c2a9", "#b77d64", "#2c2525"], exposure: 2, contrast: 2, saturation: 0, temperature: 0, tint: 0, fade: 0, smooth: 38, whiten: 10, grain: 0, bloom: 0, vignette: 0 },
  { id: "ccd", name: zh.ccdName, note: zh.ccdNote, swatches: ["#fff8ef", "#f0dad4", "#9ebbd0"], exposure: 18, contrast: -6, saturation: -4, temperature: -7, tint: 5, fade: 14, smooth: 54, whiten: 62, grain: 20, bloom: 28, vignette: 8 },
  { id: "cream", name: zh.creamName, note: zh.creamNote, swatches: ["#ffe2d0", "#f3a6a8", "#fff6c8"], exposure: 14, contrast: -10, saturation: 10, temperature: 8, tint: 10, fade: 8, smooth: 64, whiten: 42, grain: 5, bloom: 22, vignette: 0 },
  { id: "korean", name: zh.koreanName, note: zh.koreanNote, swatches: ["#e9f1ef", "#9fc4c5", "#565f77"], exposure: 6, contrast: 10, saturation: -18, temperature: -14, tint: -3, fade: 4, smooth: 42, whiten: 48, grain: 4, bloom: 8, vignette: 12 },
  { id: "film", name: zh.filmName, note: zh.filmNote, swatches: ["#e0b36c", "#7d6a55", "#314f57"], exposure: -4, contrast: 16, saturation: -8, temperature: 15, tint: -5, fade: 18, smooth: 20, whiten: 16, grain: 34, bloom: 6, vignette: 28 },
  { id: "daily", name: zh.dailyName, note: zh.dailyNote, swatches: ["#f7f0de", "#9fbd8a", "#6da2a2"], exposure: 10, contrast: 4, saturation: 8, temperature: 4, tint: -4, fade: 6, smooth: 28, whiten: 28, grain: 8, bloom: 8, vignette: 4 },
  { id: "y3k", name: zh.y3kName, note: zh.y3kNote, swatches: ["#e8f6ff", "#9d98ff", "#1c1f2b"], exposure: 8, contrast: 20, saturation: 12, temperature: -16, tint: 14, fade: 0, smooth: 24, whiten: 34, grain: 26, bloom: 36, vignette: 18 },
  { id: "spicy", name: zh.spicyName, note: zh.spicyNote, swatches: ["#2c2529", "#c33b4f", "#d49a35"], exposure: 2, contrast: 24, saturation: 18, temperature: 4, tint: 8, fade: 0, smooth: 36, whiten: 18, grain: 10, bloom: 4, vignette: 24 },
  { id: "night", name: zh.nightName, note: zh.nightNote, swatches: ["#101721", "#248e8a", "#e76973"], exposure: -8, contrast: 18, saturation: 20, temperature: -8, tint: 15, fade: 6, smooth: 26, whiten: 20, grain: 18, bloom: 42, vignette: 34 }
];

const state = {
  image: null,
  styleId: "clean",
  intensity: 42,
  blemish: 86,
  shine: 76,
  beard: 62,
  scar: 68,
  smooth: 38,
  whiten: 10,
  repairOn: true,
  grainOn: true,
  compare: 38
};

const els = {
  fileInput: document.querySelector("#fileInput"),
  downloadBtn: document.querySelector("#downloadBtn"),
  outputCanvas: document.querySelector("#outputCanvas"),
  originalCanvas: document.querySelector("#originalCanvas"),
  compareRange: document.querySelector("#compareRange"),
  splitHandle: document.querySelector("#splitHandle"),
  dropHint: document.querySelector("#dropHint"),
  styleGrid: document.querySelector("#styleGrid"),
  intensityRange: document.querySelector("#intensityRange"),
  blemishRange: document.querySelector("#blemishRange"),
  shineRange: document.querySelector("#shineRange"),
  beardRange: document.querySelector("#beardRange"),
  scarRange: document.querySelector("#scarRange"),
  smoothRange: document.querySelector("#smoothRange"),
  whitenRange: document.querySelector("#whitenRange"),
  repairToggle: document.querySelector("#repairToggle"),
  grainToggle: document.querySelector("#grainToggle"),
  resetBtn: document.querySelector("#resetBtn"),
  activeStyleName: document.querySelector("#activeStyleName"),
  repairCount: document.querySelector("#repairCount"),
  canvasSize: document.querySelector("#canvasSize")
};

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value));
}

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isSkinPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  const warm = r > b + 8 && r >= g * 0.86;
  const notTooDark = r > 74 && g > 42 && b > 28;
  const notTooFlat = chroma > 10;
  const notPureRed = r < g * 2.25;
  return notTooDark && warm && notTooFlat && notPureRed;
}

function buildStyleGrid() {
  els.styleGrid.innerHTML = "";
  styles.forEach((style) => {
    const button = document.createElement("button");
    button.className = `style-card${style.id === state.styleId ? " active" : ""}`;
    button.type = "button";
    button.dataset.style = style.id;
    button.innerHTML = `
      <div class="swatches">${style.swatches.map((color) => `<i style="background:${color}"></i>`).join("")}</div>
      <strong>${style.name}</strong>
      <span>${style.note}</span>
    `;
    button.addEventListener("click", () => {
      state.styleId = style.id;
      state.intensity = style.id === "clean" ? 42 : 78;
      state.blemish = style.id === "clean" ? 86 : 72;
      state.shine = style.id === "clean" ? 76 : 56;
      state.beard = style.id === "clean" ? 62 : 45;
      state.scar = style.id === "clean" ? 68 : 44;
      state.smooth = style.smooth;
      state.whiten = style.whiten;
      els.intensityRange.value = state.intensity;
      els.blemishRange.value = state.blemish;
      els.shineRange.value = state.shine;
      els.beardRange.value = state.beard;
      els.scarRange.value = state.scar;
      els.smoothRange.value = state.smooth;
      els.whitenRange.value = state.whiten;
      buildStyleGrid();
      render();
    });
    els.styleGrid.appendChild(button);
  });
}

function drawSpot(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function createDemoImage() {
  const demo = document.createElement("canvas");
  demo.width = 1200;
  demo.height = 1500;
  const ctx = demo.getContext("2d");
  const sky = ctx.createLinearGradient(0, 0, demo.width, demo.height);
  sky.addColorStop(0, "#dce9e3");
  sky.addColorStop(0.45, "#f5d2c3");
  sky.addColorStop(1, "#786c80");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, demo.width, demo.height);

  ctx.fillStyle = "rgba(255,255,255,.28)";
  for (let i = 0; i < 32; i += 1) {
    drawSpot(ctx, (i * 97) % demo.width, 120 + ((i * 173) % 680), 18 + (i % 5) * 12, "rgba(255,255,255,.26)");
  }

  ctx.fillStyle = "#272129";
  ctx.beginPath();
  ctx.ellipse(610, 490, 238, 315, 0.02, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f0bda8";
  ctx.beginPath();
  ctx.ellipse(600, 575, 175, 225, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#272129";
  ctx.beginPath();
  ctx.ellipse(485, 515, 82, 190, -0.35, 0, Math.PI * 2);
  ctx.ellipse(716, 505, 84, 196, 0.34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2a1d22";
  ctx.beginPath();
  ctx.ellipse(535, 592, 18, 11, 0, 0, Math.PI * 2);
  ctx.ellipse(660, 592, 18, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#5c3940";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(600, 665, 46, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.fillStyle = "#f3a6a1";
  ctx.globalAlpha = 0.38;
  ctx.beginPath();
  ctx.ellipse(487, 655, 54, 24, -0.15, 0, Math.PI * 2);
  ctx.ellipse(712, 655, 54, 24, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const blemishes = [
    [535, 548, 14, "#be5f54"], [642, 624, 10, "#98554c"], [676, 553, 8, "#c56a5a"],
    [512, 672, 9, "#8d514a"], [616, 710, 7, "#b66055"], [578, 610, 5, "#7c4a44"],
    [694, 683, 5, "#aa5d55"], [552, 727, 6, "#784940"]
  ];
  blemishes.forEach(([x, y, radius, color]) => drawSpot(ctx, x, y, radius, color));

  ctx.strokeStyle = "rgba(104,83,81,.35)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(742, 430);
  ctx.bezierCurveTo(780, 480, 775, 550, 738, 604);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.34)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(400, 930);
  ctx.bezierCurveTo(510, 904, 610, 920, 708, 890);
  ctx.stroke();

  ctx.fillStyle = "#f9efe5";
  ctx.beginPath();
  ctx.roundRect(330, 812, 540, 470, 70);
  ctx.fill();
  ctx.fillStyle = "#f0bda8";
  ctx.fillRect(536, 768, 128, 132);

  const image = new Image();
  image.onload = () => {
    state.image = image;
    render();
  };
  image.src = demo.toDataURL("image/png");
}

function fitCanvasToImage(image) {
  const maxSide = 1800;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  [els.outputCanvas, els.originalCanvas].forEach((canvas) => {
    canvas.width = width;
    canvas.height = height;
  });
  els.canvasSize.textContent = `${width} x ${height}`;
}

function drawBase() {
  fitCanvasToImage(state.image);
  const originalCtx = els.originalCanvas.getContext("2d", { willReadFrequently: true });
  const outputCtx = els.outputCanvas.getContext("2d", { willReadFrequently: true });
  originalCtx.clearRect(0, 0, els.originalCanvas.width, els.originalCanvas.height);
  outputCtx.clearRect(0, 0, els.outputCanvas.width, els.outputCanvas.height);
  originalCtx.drawImage(state.image, 0, 0, els.originalCanvas.width, els.originalCanvas.height);
  outputCtx.drawImage(state.image, 0, 0, els.outputCanvas.width, els.outputCanvas.height);
}

function makeBlurData(radius) {
  const canvas = document.createElement("canvas");
  canvas.width = els.outputCanvas.width;
  canvas.height = els.outputCanvas.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(els.outputCanvas, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
}

function growMask(mask, width, height, radius) {
  const grown = new Uint8Array(mask.length);
  for (let y = radius; y < height - radius; y += 1) {
    for (let x = radius; x < width - radius; x += 1) {
      const index = y * width + x;
      if (!mask[index]) continue;
      for (let yy = -radius; yy <= radius; yy += 1) {
        for (let xx = -radius; xx <= radius; xx += 1) {
          if (xx * xx + yy * yy <= radius * radius) {
            grown[index + yy * width + xx] = Math.max(grown[index + yy * width + xx], mask[index]);
          }
        }
      }
    }
  }
  return grown;
}

function keepSmallRepairRegions(mask, width, height) {
  const visited = new Uint8Array(mask.length);
  const kept = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  const maxArea = Math.max(45, Math.round(width * height * 0.00025));
  const maxSpan = Math.max(18, Math.round(Math.min(width, height) * 0.028));
  const minArea = 2;

  for (let p = 0; p < mask.length; p += 1) {
    if (!mask[p] || visited[p]) continue;

    let head = 0;
    let tail = 0;
    let area = 0;
    let maxConfidence = 0;
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    queue[tail] = p;
    tail += 1;
    visited[p] = 1;

    while (head < tail) {
      const current = queue[head];
      head += 1;
      area += 1;
      maxConfidence = Math.max(maxConfidence, mask[current]);
      const x = current % width;
      const y = Math.floor(current / width);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      const left = x > 0 ? current - 1 : -1;
      const right = x < width - 1 ? current + 1 : -1;
      const up = y > 0 ? current - width : -1;
      const down = y < height - 1 ? current + width : -1;
      const neighbors = [left, right, up, down];
      for (let i = 0; i < neighbors.length; i += 1) {
        const next = neighbors[i];
        if (next >= 0 && mask[next] && !visited[next]) {
          visited[next] = 1;
          queue[tail] = next;
          tail += 1;
        }
      }
    }

    const spanX = maxX - minX + 1;
    const spanY = maxY - minY + 1;
    const aspect = Math.max(spanX / spanY, spanY / spanX);
    const fill = area / (spanX * spanY);
    const smallEnough = area <= maxArea && spanX <= maxSpan && spanY <= maxSpan;
    const dotLike = aspect <= 2.4 && fill >= 0.18;
    const realMark = area >= minArea && maxConfidence >= 150;
    if (smallEnough && dotLike && realMark) {
      for (let i = 0; i < tail; i += 1) {
        kept[queue[i]] = Math.max(kept[queue[i]], maxConfidence);
      }
    }
  }

  return kept;
}

function countMaskPixels(mask) {
  let count = 0;
  for (let i = 0; i < mask.length; i += 1) {
    if (mask[i]) count += 1;
  }
  return count;
}

function applyStrongSpotHealing(ctx) {
  if (!state.repairOn || state.blemish <= 0) return 0;

  const { width, height } = els.outputCanvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const wide = makeBlurData(Math.max(10, Math.round(8 + state.blemish / 8)));
  const tiny = makeBlurData(2);
  const mask = new Uint8Array(width * height);
  const strength = state.blemish / 100;
  const darkThreshold = 7 + (1 - strength) * 8;

  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const wr = wide[i];
    const wg = wide[i + 1];
    const wb = wide[i + 2];
    const lum = luminance(r, g, b);
    const wideLum = luminance(wr, wg, wb);
    const localDiff = Math.abs(r - tiny[i]) * 0.35 + Math.abs(g - tiny[i + 1]) * 0.35 + Math.abs(b - tiny[i + 2]) * 0.3;
    const surroundedBySkin = isSkinPixel(wr, wg, wb);
    const notFeatureBlack = lum > 34 && !(r < 52 && g < 52 && b < 52);
    const warmEnough = wr > wb + 5 && wg > wb - 2;
    const darkDot = surroundedBySkin && warmEnough && notFeatureBlack && wideLum - lum > darkThreshold && localDiff > 2.5;
    if (darkDot) mask[p] = 255;
  }

  const visited = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  let healed = 0;

  for (let p = 0; p < mask.length; p += 1) {
    if (!mask[p] || visited[p]) continue;

    let head = 0;
    let tail = 0;
    let area = 0;
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    let lumSum = 0;

    queue[tail] = p;
    tail += 1;
    visited[p] = 1;

    while (head < tail) {
      const current = queue[head];
      head += 1;
      area += 1;
      const x = current % width;
      const y = Math.floor(current / width);
      const offset = current * 4;
      lumSum += luminance(data[offset], data[offset + 1], data[offset + 2]);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      const neighbors = [
        x > 0 ? current - 1 : -1,
        x < width - 1 ? current + 1 : -1,
        y > 0 ? current - width : -1,
        y < height - 1 ? current + width : -1
      ];
      for (let i = 0; i < neighbors.length; i += 1) {
        const next = neighbors[i];
        if (next >= 0 && mask[next] && !visited[next]) {
          visited[next] = 1;
          queue[tail] = next;
          tail += 1;
        }
      }
    }

    const spanX = maxX - minX + 1;
    const spanY = maxY - minY + 1;
    const aspect = Math.max(spanX / spanY, spanY / spanX);
    const fill = area / (spanX * spanY);
    const maxSpan = Math.max(7, Math.round(Math.min(width, height) * 0.032));
    if (area < 2 || area > 170 || spanX > maxSpan || spanY > maxSpan || aspect > 2.6 || fill < 0.14) {
      continue;
    }

    const ring = Math.max(5, Math.round(Math.max(spanX, spanY) * 1.8));
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let sampleCount = 0;
    const fromX = Math.max(0, minX - ring);
    const toX = Math.min(width - 1, maxX + ring);
    const fromY = Math.max(0, minY - ring);
    const toY = Math.min(height - 1, maxY + ring);

    for (let y = fromY; y <= toY; y += 1) {
      for (let x = fromX; x <= toX; x += 1) {
        const outsideBox = x < minX || x > maxX || y < minY || y > maxY;
        if (!outsideBox) continue;
        const sample = y * width + x;
        const offset = sample * 4;
        const sr = data[offset];
        const sg = data[offset + 1];
        const sb = data[offset + 2];
        const sl = luminance(sr, sg, sb);
        if (!isSkinPixel(sr, sg, sb) || sl < 52 || sl > 222) continue;
        rSum += sr;
        gSum += sg;
        bSum += sb;
        sampleCount += 1;
      }
    }

    if (sampleCount < 12) continue;
    const targetR = rSum / sampleCount;
    const targetG = gSum / sampleCount;
    const targetB = bSum / sampleCount;
    const targetLum = luminance(targetR, targetG, targetB);
    if (targetLum - lumSum / area < 6) continue;

    const grow = Math.max(1, Math.round(Math.max(spanX, spanY) * 0.28));
    const blend = Math.min(0.92, 0.62 + strength * 0.24);
    for (let y = Math.max(0, minY - grow); y <= Math.min(height - 1, maxY + grow); y += 1) {
      for (let x = Math.max(0, minX - grow); x <= Math.min(width - 1, maxX + grow); x += 1) {
        const dx = x < minX ? minX - x : x > maxX ? x - maxX : 0;
        const dy = y < minY ? minY - y : y > maxY ? y - maxY : 0;
        if (dx * dx + dy * dy > grow * grow) continue;
        const offset = (y * width + x) * 4;
        if (!isSkinPixel(wide[offset], wide[offset + 1], wide[offset + 2])) continue;
        const edgeBlend = dx || dy ? blend * 0.45 : blend;
        data[offset] = clamp(data[offset] * (1 - edgeBlend) + targetR * edgeBlend);
        data[offset + 1] = clamp(data[offset + 1] * (1 - edgeBlend) + targetG * edgeBlend);
        data[offset + 2] = clamp(data[offset + 2] * (1 - edgeBlend) + targetB * edgeBlend);
        healed += 1;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return healed;
}

function blendRepairRegionsWithBoundary(data, repairMask, width, height, strength) {
  const visited = new Uint8Array(repairMask.length);
  const queue = new Int32Array(repairMask.length);
  const ring = Math.max(7, Math.round(6 + strength * 12));

  for (let p = 0; p < repairMask.length; p += 1) {
    if (!repairMask[p] || visited[p]) continue;

    let head = 0;
    let tail = 0;
    let maxConfidence = 0;
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    let skinPixels = 0;

    queue[tail] = p;
    tail += 1;
    visited[p] = 1;

    while (head < tail) {
      const current = queue[head];
      head += 1;
      maxConfidence = Math.max(maxConfidence, repairMask[current]);
      const x = current % width;
      const y = Math.floor(current / width);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      const currentOffset = current * 4;
      if (isSkinPixel(data[currentOffset], data[currentOffset + 1], data[currentOffset + 2])) {
        skinPixels += 1;
      }

      const neighbors = [
        x > 0 ? current - 1 : -1,
        x < width - 1 ? current + 1 : -1,
        y > 0 ? current - width : -1,
        y < height - 1 ? current + width : -1
      ];
      for (let i = 0; i < neighbors.length; i += 1) {
        const next = neighbors[i];
        if (next >= 0 && repairMask[next] && !visited[next]) {
          visited[next] = 1;
          queue[tail] = next;
          tail += 1;
        }
      }
    }

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let count = 0;
    const fromX = Math.max(0, minX - ring);
    const toX = Math.min(width - 1, maxX + ring);
    const fromY = Math.max(0, minY - ring);
    const toY = Math.min(height - 1, maxY + ring);

    for (let y = fromY; y <= toY; y += 1) {
      for (let x = fromX; x <= toX; x += 1) {
        const sample = y * width + x;
        if (repairMask[sample]) continue;
        const outsideBox = x < minX || x > maxX || y < minY || y > maxY;
        if (!outsideBox) continue;
        const i = sample * 4;
        if (skinPixels / tail > 0.45 && !isSkinPixel(data[i], data[i + 1], data[i + 2])) continue;
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
        count += 1;
      }
    }

    if (count < 8) continue;
    const targetR = rSum / count;
    const targetG = gSum / count;
    const targetB = bSum / count;
    const baseBlend = Math.min(0.95, 0.64 + strength * 0.32 + (maxConfidence / 255) * 0.1);

    for (let i = 0; i < tail; i += 1) {
      const pixel = queue[i];
      const offset = pixel * 4;
      const confidenceBlend = baseBlend * (repairMask[pixel] / maxConfidence);
      data[offset] = clamp(data[offset] * (1 - confidenceBlend) + targetR * confidenceBlend);
      data[offset + 1] = clamp(data[offset + 1] * (1 - confidenceBlend) + targetG * confidenceBlend);
      data[offset + 2] = clamp(data[offset + 2] * (1 - confidenceBlend) + targetB * confidenceBlend);
    }
  }
}

function applySkinRefinement(ctx) {
  if (!state.repairOn || state.blemish <= 0) return 0;

  const { width, height } = els.outputCanvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const clean = makeBlurData(Math.max(5, Math.round(4 + state.blemish / 14)));
  const glow = makeBlurData(Math.max(10, Math.round(8 + state.blemish / 9)));
  const strength = state.blemish / 100;
  let refined = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (!isSkinPixel(r, g, b)) continue;

    const lum = luminance(r, g, b);
    const cleanLum = luminance(clean[i], clean[i + 1], clean[i + 2]);
    const edgeDiff = Math.abs(lum - cleanLum);
    const tooDarkForSkinDetail = lum < 48;
    const tooBrightHighlight = lum > 226;
    const strongEdge = edgeDiff > 22 + (1 - strength) * 10;
    if (tooDarkForSkinDetail || tooBrightHighlight || strongEdge) continue;

    const microDiff = Math.abs(r - clean[i]) * 0.35 + Math.abs(g - clean[i + 1]) * 0.35 + Math.abs(b - clean[i + 2]) * 0.3;
    const blend = Math.min(0.46, (0.12 + microDiff / 80) * strength);
    const targetR = clean[i] * 0.72 + glow[i] * 0.28;
    const targetG = clean[i + 1] * 0.72 + glow[i + 1] * 0.28;
    const targetB = clean[i + 2] * 0.72 + glow[i + 2] * 0.28;
    data[i] = clamp(r * (1 - blend) + targetR * blend);
    data[i + 1] = clamp(g * (1 - blend) + targetG * blend);
    data[i + 2] = clamp(b * (1 - blend) + targetB * blend);
    refined += 1;
  }

  ctx.putImageData(imageData, 0, 0);
  return refined;
}

function applyShineReduction(ctx) {
  if (!state.repairOn || state.shine <= 0) return 0;

  const { width, height } = els.outputCanvas;
  const wide = makeBlurData(Math.max(12, Math.round(10 + state.shine / 7)));
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const strength = state.shine / 100;
  let changed = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const wr = wide[i];
    const wg = wide[i + 1];
    const wb = wide[i + 2];
    const lum = luminance(r, g, b);
    const wideLum = luminance(wr, wg, wb);
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    const skinArea = isSkinPixel(r, g, b) || isSkinPixel(wr, wg, wb);
    const oilyHighlight = skinArea && lum > 136 && lum - wideLum > 7 && chroma < 92;
    if (!oilyHighlight) continue;

    const pressure = Math.min(1, (lum - wideLum) / 54);
    const blend = Math.min(0.82, pressure * (0.34 + strength * 0.54));
    const targetLum = wideLum + Math.min(10, (lum - wideLum) * 0.16);
    const scale = targetLum / Math.max(1, wideLum);
    const targetR = clamp(wr * scale);
    const targetG = clamp(wg * scale);
    const targetB = clamp(wb * scale);
    data[i] = clamp(r * (1 - blend) + targetR * blend);
    data[i + 1] = clamp(g * (1 - blend) + targetG * blend);
    data[i + 2] = clamp(b * (1 - blend) + targetB * blend);
    changed += 1;
  }

  ctx.putImageData(imageData, 0, 0);
  return changed;
}

function applyBeardShadowReduction(ctx) {
  if (!state.repairOn || state.beard <= 0) return 0;

  const { width, height } = els.outputCanvas;
  const wide = makeBlurData(Math.max(13, Math.round(10 + state.beard / 7)));
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const strength = state.beard / 100;
  let changed = 0;

  for (let y = 0; y < height; y += 1) {
    const yNorm = y / height;
    if (yNorm < 0.43) continue;
    for (let x = 0; x < width; x += 1) {
      const xNorm = x / width;
      if (xNorm < 0.12 || xNorm > 0.88) continue;
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const wr = wide[i];
      const wg = wide[i + 1];
      const wb = wide[i + 2];
      const lum = luminance(r, g, b);
      const wideLum = luminance(wr, wg, wb);
      const surroundedBySkin = isSkinPixel(wr, wg, wb) || (wr > 78 && wg > 52 && wb > 38 && wr > wb + 2 && wr >= wg * 0.78);
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      const coolGray = b >= r - 24 || chroma < 42;
      const lipLike = r > g + 16 && r > b + 18;
      const lowerFace = yNorm > 0.54;
      const shadow = surroundedBySkin && !lipLike && lum > 40 && lum < 172 && (coolGray || lowerFace) && (wideLum - lum > -3 || lowerFace);
      if (!shadow) continue;

      const pressure = Math.min(1, Math.max(lowerFace ? 0.32 : 0.18, (wideLum - lum + 5) / 24));
      const blend = Math.min(0.78, pressure * (0.28 + strength * 0.54));
      const warmR = wr + 4 + strength * 6;
      const warmG = wg + 2 + strength * 3;
      const warmB = wb - 4 - strength * 8;
      data[i] = clamp(r * (1 - blend) + warmR * blend);
      data[i + 1] = clamp(g * (1 - blend) + warmG * blend);
      data[i + 2] = clamp(b * (1 - blend) + warmB * blend);
      changed += 1;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return changed;
}

function applyScarTextureHealing(ctx) {
  if (!state.repairOn || state.scar <= 0) return 0;

  const { width, height } = els.outputCanvas;
  const small = makeBlurData(2);
  const wide = makeBlurData(Math.max(8, Math.round(6 + state.scar / 9)));
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const strength = state.scar / 100;
  let changed = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const skinArea = isSkinPixel(r, g, b) || isSkinPixel(wide[i], wide[i + 1], wide[i + 2]);
    if (!skinArea) continue;

    const lum = luminance(r, g, b);
    const smallLum = luminance(small[i], small[i + 1], small[i + 2]);
    const wideLum = luminance(wide[i], wide[i + 1], wide[i + 2]);
    const fineTexture = Math.abs(lum - smallLum);
    const unevenPatch = Math.abs(lum - wideLum);
    const notFeature = lum > 50 && lum < 218 && fineTexture < 34 && unevenPatch > 3.5 && unevenPatch < 38;
    if (!notFeature) continue;

    const pressure = Math.min(1, unevenPatch / 24);
    const blend = Math.min(0.48, pressure * (0.12 + strength * 0.36));
    data[i] = clamp(r * (1 - blend) + wide[i] * blend);
    data[i + 1] = clamp(g * (1 - blend) + wide[i + 1] * blend);
    data[i + 2] = clamp(b * (1 - blend) + wide[i + 2] * blend);
    changed += 1;
  }

  ctx.putImageData(imageData, 0, 0);
  return changed;
}

function applyBlemishRepair(ctx) {
  if (!state.repairOn || state.blemish <= 0) {
    els.repairCount.textContent = "0";
    window.__repairStats = { candidates: 0, repairPixels: 0, repaired: 0 };
    return;
  }

  const { width, height } = els.outputCanvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const smallBlur = makeBlurData(3);
  const largeBlur = makeBlurData(Math.max(14, Math.round(12 + state.blemish / 7)));
  const mask = new Uint8Array(width * height);
  const strongMask = new Uint8Array(width * height);
  const strength = state.blemish / 100;
  const darkThreshold = 5 + (1 - strength) * 10;
  const redThreshold = 7 + (1 - strength) * 12;
  let candidates = 0;

  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const br = smallBlur[i];
    const bg = smallBlur[i + 1];
    const bb = smallBlur[i + 2];
    const lr = largeBlur[i];
    const lg = largeBlur[i + 1];
    const lb = largeBlur[i + 2];
    const lum = luminance(r, g, b);
    const baseLum = luminance(br, bg, bb);
    const wideLum = luminance(lr, lg, lb);
    const skin = isSkinPixel(r, g, b) || isSkinPixel(br, bg, bb) || isSkinPixel(lr, lg, lb);
    const localDiff = Math.abs(r - br) * 0.35 + Math.abs(g - bg) * 0.35 + Math.abs(b - bb) * 0.3;
    const redExcess = r - Math.max(g, b);
    const darkSpot = Math.max(baseLum, wideLum) - lum;
    const redMark = redExcess > redThreshold && r > 92 && localDiff > 3;
    const darkMark = darkSpot > darkThreshold && localDiff > 3 && lum > 35;
    const brownMark = skin && r > g && g > b && darkSpot > 3 && localDiff > 2 && lum < wideLum - 2;
    const warmDarkCenter = r > b + 6 && g > b + 2 && r > g * 0.82;
    const strongDark = skin && warmDarkCenter && darkSpot > 34 && localDiff > 14 && lum < wideLum - 22 && lum > 24;
    const strongRed = false;
    const likelyBlemish = skin && (redMark || darkMark);

    if (likelyBlemish || brownMark) {
      mask[p] = 255;
      candidates += 1;
    }
    if (strongDark || strongRed) {
      strongMask[p] = 255;
    }
  }

  const smallRegions = keepSmallRepairRegions(mask, width, height);
  let repairMask = growMask(smallRegions, width, height, Math.max(1, Math.round(1 + strength * 1.5)));
  let repairPixels = countMaskPixels(repairMask);
  if (repairPixels > Math.max(22000, Math.round(width * height * 0.07))) {
    const strongRegions = keepSmallRepairRegions(strongMask, width, height);
    repairMask = growMask(strongRegions, width, height, Math.max(1, Math.round(1 + strength)));
    repairPixels = countMaskPixels(repairMask);
    if (repairPixels > Math.max(26000, Math.round(width * height * 0.075))) {
      els.repairCount.textContent = "0";
      window.__repairStats = { candidates, repairPixels, repaired: 0, skipped: true };
      return;
    }
  }
  let repaired = 0;
  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    if (!repairMask[p]) continue;
    const blend = Math.min(0.62, (repairMask[p] / 255) * (0.38 + strength * 0.22));
    const skin = isSkinPixel(data[i], data[i + 1], data[i + 2]);
    const useWidePatch = skin || repairMask[p] >= 220;
    const cleanR = useWidePatch ? largeBlur[i] : smallBlur[i];
    const cleanG = useWidePatch ? largeBlur[i + 1] : smallBlur[i + 1];
    const cleanB = useWidePatch ? largeBlur[i + 2] : smallBlur[i + 2];
    data[i] = clamp(data[i] * (1 - blend) + cleanR * blend);
    data[i + 1] = clamp(data[i + 1] * (1 - blend) + cleanG * blend);
    data[i + 2] = clamp(data[i + 2] * (1 - blend) + cleanB * blend);
    repaired += 1;
  }

  ctx.putImageData(imageData, 0, 0);
  els.repairCount.textContent = candidates ? `${repaired}` : "0";
  window.__repairStats = { candidates, repairPixels, repaired };
  return repaired;
}

function applyTone(ctx, style, mix) {
  const { width, height } = els.outputCanvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const exposure = style.exposure * mix + state.whiten * 0.18;
  const contrast = style.contrast * mix;
  const saturation = style.saturation * mix;
  const temperature = style.temperature * mix;
  const tint = style.tint * mix;
  const fade = style.fade * mix;
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const satFactor = 1 + saturation / 100;
  const smoothMix = Math.max(style.smooth, state.smooth) / 100;
  const whitenMix = state.whiten / 100;
  const blurCanvas = document.createElement("canvas");
  blurCanvas.width = width;
  blurCanvas.height = height;
  const blurCtx = blurCanvas.getContext("2d", { willReadFrequently: true });
  blurCtx.filter = `blur(${Math.max(3, Math.round(8 * smoothMix))}px)`;
  blurCtx.drawImage(els.outputCanvas, 0, 0);
  const blurData = blurCtx.getImageData(0, 0, width, height).data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    const isSkin = isSkinPixel(r, g, b);

    if (isSkin) {
      const localSmooth = 0.42 * smoothMix * mix;
      r = r * (1 - localSmooth) + blurData[i] * localSmooth;
      g = g * (1 - localSmooth) + blurData[i + 1] * localSmooth;
      b = b * (1 - localSmooth) + blurData[i + 2] * localSmooth;
      r += 18 * whitenMix * mix;
      g += 15 * whitenMix * mix;
      b += 12 * whitenMix * mix;
    }

    r += exposure + temperature * 0.9 + tint * 0.35;
    g += exposure - Math.abs(tint) * 0.12;
    b += exposure - temperature * 0.9 + tint * 0.55;
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    const lum = luminance(r, g, b);
    r = lum + (r - lum) * satFactor;
    g = lum + (g - lum) * satFactor;
    b = lum + (b - lum) * satFactor;
    r = r + (245 - r) * (fade / 100);
    g = g + (238 - g) * (fade / 100);
    b = b + (228 - b) * (fade / 100);

    data[i] = clamp(r);
    data[i + 1] = clamp(g);
    data[i + 2] = clamp(b);
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyOverlays(ctx, style, mix) {
  const { width, height } = els.outputCanvas;
  if (style.bloom > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = (style.bloom / 100) * mix;
    ctx.filter = "blur(18px) brightness(1.18)";
    ctx.drawImage(els.outputCanvas, 0, 0);
    ctx.restore();
    ctx.filter = "none";
  }

  if (style.vignette > 0) {
    const gradient = ctx.createRadialGradient(width / 2, height * 0.42, Math.min(width, height) * 0.2, width / 2, height / 2, Math.max(width, height) * 0.72);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, `rgba(19,18,20,${(style.vignette / 100) * 0.65 * mix})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  if (state.grainOn && style.grain > 0) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const amount = style.grain * mix;
    let seed = 17;
    for (let i = 0; i < data.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const noise = ((seed / 4294967295) - 0.5) * amount;
      data[i] = clamp(data[i] + noise);
      data[i + 1] = clamp(data[i + 1] + noise);
      data[i + 2] = clamp(data[i + 2] + noise);
    }
    ctx.putImageData(imageData, 0, 0);
  }
}

function updateCompare() {
  const hiddenRight = 100 - state.compare;
  els.originalCanvas.style.clipPath = `inset(0 ${hiddenRight}% 0 0)`;
  els.splitHandle.style.left = `${state.compare}%`;
}

function render() {
  if (!state.image) return;
  const style = styles.find((item) => item.id === state.styleId) || styles[0];
  const mix = state.intensity / 100;
  drawBase();
  const ctx = els.outputCanvas.getContext("2d", { willReadFrequently: true });
  const refined = applySkinRefinement(ctx);
  const scar = applyScarTextureHealing(ctx);
  const repaired = applyStrongSpotHealing(ctx);
  const shine = applyShineReduction(ctx);
  const beard = applyBeardShadowReduction(ctx);
  applyTone(ctx, style, mix);
  applyOverlays(ctx, style, mix);
  els.repairCount.textContent = `${refined + scar + repaired + shine + beard}`;
  window.__repairStats = { refined, scar, repaired, shine, beard };
  els.activeStyleName.textContent = style.name;
  els.dropHint.classList.remove("visible");
  updateCompare();
}

function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const image = new Image();
  image.onload = () => {
    state.image = image;
    render();
    URL.revokeObjectURL(image.src);
  };
  image.src = URL.createObjectURL(file);
}

els.fileInput.addEventListener("change", (event) => loadFile(event.target.files[0]));
els.downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `retouched-${Date.now()}.png`;
  link.href = els.outputCanvas.toDataURL("image/png");
  link.click();
});
els.compareRange.addEventListener("input", () => {
  state.compare = Number(els.compareRange.value);
  updateCompare();
});
els.intensityRange.addEventListener("input", () => {
  state.intensity = Number(els.intensityRange.value);
  render();
});
els.blemishRange.addEventListener("input", () => {
  state.blemish = Number(els.blemishRange.value);
  render();
});
els.shineRange.addEventListener("input", () => {
  state.shine = Number(els.shineRange.value);
  render();
});
els.beardRange.addEventListener("input", () => {
  state.beard = Number(els.beardRange.value);
  render();
});
els.scarRange.addEventListener("input", () => {
  state.scar = Number(els.scarRange.value);
  render();
});
els.smoothRange.addEventListener("input", () => {
  state.smooth = Number(els.smoothRange.value);
  render();
});
els.whitenRange.addEventListener("input", () => {
  state.whiten = Number(els.whitenRange.value);
  render();
});
els.repairToggle.addEventListener("change", () => {
  state.repairOn = els.repairToggle.checked;
  render();
});
els.grainToggle.addEventListener("change", () => {
  state.grainOn = els.grainToggle.checked;
  render();
});
els.resetBtn.addEventListener("click", () => {
  const style = styles.find((item) => item.id === state.styleId) || styles[0];
  state.intensity = style.id === "clean" ? 42 : 78;
  state.blemish = style.id === "clean" ? 86 : 72;
  state.shine = style.id === "clean" ? 76 : 56;
  state.beard = style.id === "clean" ? 62 : 45;
  state.scar = style.id === "clean" ? 68 : 44;
  state.smooth = style.smooth;
  state.whiten = style.whiten;
  state.repairOn = true;
  state.grainOn = true;
  els.intensityRange.value = state.intensity;
  els.blemishRange.value = state.blemish;
  els.shineRange.value = state.shine;
  els.beardRange.value = state.beard;
  els.scarRange.value = state.scar;
  els.smoothRange.value = state.smooth;
  els.whitenRange.value = state.whiten;
  els.repairToggle.checked = state.repairOn;
  els.grainToggle.checked = state.grainOn;
  render();
});

document.addEventListener("dragover", (event) => {
  event.preventDefault();
  els.dropHint.classList.add("visible");
});
document.addEventListener("dragleave", () => {
  if (state.image) els.dropHint.classList.remove("visible");
});
document.addEventListener("drop", (event) => {
  event.preventDefault();
  loadFile(event.dataTransfer.files[0]);
});

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function roundRect(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + width, y, x + width, y + height, r);
    this.arcTo(x + width, y + height, x, y + height, r);
    this.arcTo(x, y + height, x, y, r);
    this.arcTo(x, y, x + width, y, r);
    this.closePath();
  };
}

buildStyleGrid();
createDemoImage();
