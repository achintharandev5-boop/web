import js from '@eslint/js'
import ts from 'typescript-eslint'
export default [js.configs.recommended, ...ts.configs.recommended, {files:['scripts/*.mjs'], languageOptions:{globals:{process:'readonly',URL:'readonly'}}}]
