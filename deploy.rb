require 'yaml'

stage = ARGV[0]

unless stage
  puts "\n\nStage argument is required! Command should be used like so:\nruby deploy.rb stage\n\n"
  return
end

supported_stages = %w[dev prod]

unless supported_stages.include? stage
  puts "\n\nUnsupported stage: #{stage}. Valid stages are: #{supported_stages}\n\n"
  return
end

puts "\nBuilding serverless.yml with correct bucket name for stage: #{stage}"
serverless = YAML.load_file('serverless.yml')
bucket_name = serverless['custom']['imageUploaderBucket']

puts "Found Bucket name: #{bucket_name}"

supported_stages.each {|supported_stage| bucket_name.gsub!(/-?#{supported_stage}\Z/, '')}

puts "Trimmed bucket name to not include stage suffix: #{bucket_name}"

s3_name = 'S3Bucket' + bucket_name.gsub('-', '').capitalize

puts "Looking for resource name starting with: #{s3_name}"

puts "Looking through keys: #{serverless['resources']['Resources'].keys}"
found_keys = serverless['resources']['Resources'].keys.select{ |key| /#{s3_name}.*/.match(key)}



if found_keys.size > 1
  puts "\n\nFound more than one possible bucket name. Not sure what to do: #{found_keys}\n\n"
  return
end

if found_keys.size < 1
  puts "\nFailed to find a resource matching: \"#{s3_name}\". Found Keys: #{found_keys}\n\n"
  return
end

puts "Changing values to match stage #{stage}"

new_bucket_name = bucket_name + "-#{stage}"

puts "New bucket name: #{new_bucket_name}"
serverless['custom']['imageUploaderBucket'] = new_bucket_name

new_s3_name = 'S3Bucket' + bucket_name.gsub('-', '').capitalize + stage

puts "New s3 resource name: #{new_s3_name}"
serverless['resources']['Resources'][new_s3_name] = serverless['resources']['Resources'].delete(found_keys.first)

puts "Writing new serverless.yml"

File.open('serverless.yml', 'w') {|file| file.write(serverless.to_yaml)}

puts "\nDone!\n"

puts "\nCalling sls deploy!\n\n"

output = []
r, io = IO.pipe
fork do
  system("sls deploy --stage #{stage} -v", out: io, err: :out)
end
io.close
r.each_line{|l| puts l; output << l.chomp}