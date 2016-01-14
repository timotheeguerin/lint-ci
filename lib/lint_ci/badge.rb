# Class that handle download badge from shields.io
class LintCI::Badge
  # Left side of the badge
  attr_accessor :label

  # Right side of the badge
  attr_accessor :value

  # Right side color
  attr_accessor :color

  def initialize(label, value, color, params = {})
    @label = label
    @value = value
    @color = color
    @params = params
  end

  def segment
    [@label, @value, @color].join('-')
  end

  def shields_url
    "https://img.shields.io/badge/#{segment}.svg#{shields_params}"
  end

  def shields_params
    return '' if @params.empty?
    "?#{@params.to_query}"
  end

  def filename
    "#{segment}#{shields_params}.svg"
  end

  def path
    File.join(LintCI.badge_path, filename)
  end

  def download
    data = open(shields_url, 'rb')
    FileUtils.mkdir_p(LintCI.badge_path)
    File.open(path, 'wb') do |f|
      f.write data.read
    end
  end

  def file
    download unless File.exist?(path)
    path
  end
end
