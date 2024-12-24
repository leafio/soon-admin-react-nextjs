import path from 'path';
import { fileURLToPath } from "url"
import withBundleAnalyzer from '@next/bundle-analyzer'
// import pkg from './build/parse.mjs'
// //console.log(pkg)
import { parseBaseUrl } from './env/parse.mjs'
// const {parseBaseUrl}=pkg
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//console.log('dirname', __dirname)
// console.log('env', process.env)
let rewrites = undefined

const { NODE_ENV, NEXT_PUBLIC_DEV_PROXY } = process.env
if (NODE_ENV === 'development' && NEXT_PUBLIC_DEV_PROXY === 'true') {
    const prefix = parseBaseUrl(process.env, true)
    rewrites = () => {
        return [
            {
                source: prefix + '/:path*',
                destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
            },
        ]
    }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'dist',
    // reactStrictMode: false,
    rewrites
    ,
    sassOptions: {
        includePaths: [path.join(__dirname, 'src/css')],
    },
};

const enabledAnalyze = process.env.ANALYZE === 'true'


export default withBundleAnalyzer({
    enabled: enabledAnalyze,
    openAnalyzer: enabledAnalyze,

})(nextConfig);
