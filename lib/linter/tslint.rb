# Linter
class Linter::TsLint < Linter::Base
  language :typescript
  keys :tslint, :typescript

  def run_linter
    out = exec("#{exe} #{runner}")
    JSON.parse(out)
  end

  def upload(json)
    json.each do |path, file_hash|
      @revision.files << parse_file(path, file_hash)
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
    offense = new_offense(json['failure'])
    parse_location(offense, json)
    offense.severity = :warning
    offense
  end

  def parse_location(offense, json)
    offense.line = json['startPosition']['line'] + 1
    offense.column = json['startPosition']['character'] + 1

    if json['startPosition']['line'] != json['endPosition']['line']
      offense.length = 1
    else
      offense.length =  json['endPosition']['character'] - json['startPosition']['character']
    end
  end

  def exe
    'node'
  end

  def runner
    File.join(File.dirname(__FILE__), 'tslint', 'runner.js')
  end
end
