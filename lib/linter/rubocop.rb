# Linter
class Linter::Rubocop < Linter::Base
  def review
    out = `rubocop --format json`
    json = JSON.parse(out)
    parse_json(json)
  end

  def parse_json(json)
    json['files'].each do |file_hash|
      @revision.files << parse_file(file_hash)
    end
  end

  def parse_file(json)
    file = RevisionFile.new
    file.path = json['path']
    json['offenses'].each do |offense_hash|
      file.offenses << parse_offense(offense_hash)
    end
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
