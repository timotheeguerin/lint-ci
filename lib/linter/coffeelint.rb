# Linter
class Linter::CoffeeLint < Linter::Base
  language :coffeescript
  keys :coffeelint, :coffeescript

  def run_linter
    out = exec("#{exe} . --reporter=#{reporter}")
    JSON.parse(out)
  end

  def upload(json)
    json.each do |path, file_hash|
      @revision.files << parse_file(path[2..-1], file_hash)
    end
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
    offense = new_offense(json['message'])
    parse_location(offense, json)
    offense.severity = json['level']
    offense
  end

  def parse_location(offense, json)
    offense.line = json['lineNumber']
    offense.column = 1
    offense.length = 1
  end

  def exe
    File.join(node_modules_bin, 'coffeelint')
  end

  def reporter
    'raw'
  end
end
