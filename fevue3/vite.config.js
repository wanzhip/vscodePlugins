import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(command, mode);
  const commonConfig = {
    plugins: [vue()],
    base:'./',
    resolve: {
      alias: {
        views: resolve(__dirname, 'src/views'),
        components: resolve(__dirname, 'src/components'),
        utils: resolve(__dirname, 'src/utils'),
        src: resolve(__dirname, 'src'),
      },
    },
  }
  if (command === 'serve') {
    return {
      server: {
        port: '3000'
      },
      build: {
        rollupOptions: {
          output: {
            chunkFileNames: 'assets/[name].js',
            entryFileNames: 'assets/[name].js',
            assetFileNames: 'assets/[name].[ext]',
          },
        }
      },
      ...commonConfig,
    }
  }
  return {
    build: {
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
      // 取消计算文件大小，加快打包速度
      reportCompressedSize: false,
      sourcemap: true,
      // assetsDir: 'static/img',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/[name].js',
          entryFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
    ...commonConfig,
  }
})
