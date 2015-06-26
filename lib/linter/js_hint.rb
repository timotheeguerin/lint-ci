# Linter
class Linter::JsHint < Linter::Base
  language :javascript
  keys :jshint, :javascript

  def run_linter
    out = `jshint **/*.js --reporter=#{reporter}`
    JSON.parse(out)
  end

  def upload(json)
    files = group_by_file(json)
    files.each do |path, file_hash| 
      @revision.files << parse_file(path, file_hash)
    end
    @revision.offense_count = json['summary']['offense_count']
  end
  
  def group_by_file(json)
    files = {}
    json.each do |hash|
      path = hash['file']
      files[path] ||= []
      files[path] << hash['error']
    end
    files
  end

  def parse_file(path, json)
    file = new_file(path)
    json.each do |offense_hash|
      file.offenses << parse_offense(offense_hash)
    end
    file.offense_count = file.offenses.size
    file
  end

  def parse_offense(json)
    offense = Offense.new
    offense.message = json['reason']
    parse_location(offense, json['location'])
    offense.severity = json['id'][1...-1].to_sym
    offense
  end

  def parse_location(offense, json)
    offense.line = json['line']
    offense.column = json['character']
    offense.length = 1
  end
  
  def reporter
    File.join(File.dirname(__FILE__), 'jshint', 'reporter.js')
  end
end
