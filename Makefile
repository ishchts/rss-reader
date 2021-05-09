build:
	rm -rf dist
	NODE_ENV=production npx webpack

develop:
	npx webpack serve

lint:
	npx eslint .

test-with-coverage:
	npm test -- --coverage --coverageProvider=v8
