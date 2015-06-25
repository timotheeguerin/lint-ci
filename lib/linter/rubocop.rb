# Linter
class Linter::Rubocop < Linter::Base
  language :ruby
  keys :rubocop, :ruby

  def run_linter
    out = `rubocop --format json`
    JSON.parse(out)
  end

  def upload(json)
    json['files'].each do |file_hash|
      @revision.files << parse_file(file_hash)
    end
    @revision.offense_count = json['summary']['offense_count']
  end

  def parse_file(json)
    file = new_file(json['path'])
    json['offenses'].each do |offense_hash|
      file.offenses << parse_offense(offense_hash)
    end
    file.offense_count = file.offenses.size
    file
  end

  def parse_offense(json)
    offense = Offense.new
    offense.message = json['message']
    parse_location(offense, json['location'])
    offense.severity = json['severity'].to_sym
    offense
  end

  def parse_location(offense, json)
    offense.line = json['line']
    offense.column = json['column']
    offense.length = json['length']
  end
end
