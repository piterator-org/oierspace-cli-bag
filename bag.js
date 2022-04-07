env.exports = async (...argv) => {
	const opt = minimist(argv, {
		boolean: [ "categories", "posts" ],
		string: [ "category" ],
		alias: {
			c: "categories",
			p: "posts"
		}
	})
	await axios.get(
		`https://${opt._[0]}.oier.space/api/${
			opt._.length > 1
			? "post.json?slug=" + opt._[1]
			: (opt.c
				? "categories.json"
				: (opt.category ? "category.json?slug=" + opt.category : "posts.json")
			)
		}`
	).then(res => {
		if (opt._.length > 1) {
			term.writeln(chalk.yellowBright(res.data.post.title) + chalk.greenBright(` [${res.data.post.create_time}]`))
			term.writeln(chalk.white(res.data.post.content.replace("\n", "\r\n")))
		}
		else {
			term.writeln(`${opt._[0]}'s ${opt.c ? "categories" : "posts" + (opt.category ? " in category " + chalk.blueBright(res.data.category.title) : "")}`)
			for (const i of (
				opt.c
				? res.data.categories
				: (opt.category ? res.data.category.posts : res.data.posts)
			)) {
				term.writeln("* " + chalk.yellowBright(i.title) + chalk.greenBright(` [${i.slug}]`))
				term.writeln(`\t${chalk.cyanBright(i.intro)}`)
			}
		}
	}).catch(err => {
		term.writeln(term.formatErr(err))
	})
}
