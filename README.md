# ProResizer 🖼️

ProResizer is a highly aesthetic, production-ready Image Resizer and Dimension Converter web application built with **React** and **Tailwind CSS**. It performs all image processing locally and securely within your browser using the HTML5 Canvas API.

## 🚀 Features

- **Drag-and-Drop Uploader**: Fluid, animated drop zone supporting JPEG, PNG, and WebP.
- **Client-Side Compression**: An intelligent binary-search algorithm that accurately matches your target file size (e.g., 500 KB) by adjusting image quality dynamically.
- **Dimension Converter**: Automatically converts between Pixels, Centimeters, and Inches assuming a 300 DPI print standard, with an Aspect Ratio lock.
- **Real-time Preview**: A side-by-side view showing the original vs. the processed image, real-time file size savings, and dimensions.
- **Privacy First**: Zero server uploads. Everything happens on your machine.
- **Modern Aesthetic**: Deep slate dark mode, glowing accents, and smooth micro-interactions.

## 🛠️ Tech Stack

- [React 18](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v3](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (Icons)

## 🏃‍♂️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/pro-resizer.git
   cd pro-resizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
