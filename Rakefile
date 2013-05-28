js_compiler = 'D:\compiler.jar'

task :default => [:compile_sahi_ext]

task :compile_sahi_ext do
	sh "java -jar #{js_compiler} --js src/*.js --js_output_file target/sahi-ext.min.js"
	def replace_sah_script
		sahi_wait = nil
		js = nil
		File.open('src/sahi-ext.sah', 'r') do |file|
			sahi_wait = file.read;
		end
		File.open('target/sahi-ext.min.js', 'r') do |file|
			js = file.read;
		end
		sahi_wait.sub!(/<browser>.*<\/browser>/m, "<browser>#{js}//@ sourceURL=sahi-ext.js</browser>");
		File.open('target/sahi-ext.sah', 'w+') do |file|
			file.puts(sahi_wait);
		end
	end
	replace_sah_script
end