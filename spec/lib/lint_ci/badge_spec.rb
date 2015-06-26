require 'rails_helper'

RSpec.describe LintCI::Badge do
  describe '#segment' do
    it 'join the label value and color with -' do
      badge = LintCI::Badge.new('Style', 'Great', 'green')
      expect(badge.segment).to eq('Style-Great-green')
    end
  end

  describe '#shields_params' do
    subject { LintCI::Badge.new('Style', 'Great', 'green', params) }

    context 'when params is empty' do
      let(:params) { {} }
      it 'return an empty string' do
        expect(subject.shields_params).to eq('')
      end
    end

    context 'when params defined' do
      let(:params) { {style: 'flat-square', label: 'New label'} }

      it 'return join the params in a http query format' do
        expect(subject.shields_params).to eq('?label=New+label&style=flat-square')
      end
    end
  end

  describe '#shields_url' do
    it 'return a shields.io url' do
      badge = LintCI::Badge.new('Style', 'Great', 'green')
      expect(badge.shields_url).to eq('https://img.shields.io/badge/Style-Great-green.svg')
    end

    it 'return a shields.io url with params' do
      badge = LintCI::Badge.new('Style', 'Great', 'green', style: 'flat-square')
      expect(badge.shields_url)
        .to eq('https://img.shields.io/badge/Style-Great-green.svg?style=flat-square')
    end
  end

  describe '#filename' do
    it 'return filename' do
      badge = LintCI::Badge.new('Style', 'Great', 'green')
      expect(badge.filename).to eq('Style-Great-green.svg')
    end

    it 'return a shields.io url with params' do
      badge = LintCI::Badge.new('Style', 'Great', 'green', style: 'flat-square')
      expect(badge.filename)
        .to eq('Style-Great-green?style=flat-square.svg')
    end
  end

  describe '#download' do
    subject { LintCI::Badge.new('Style', 'Great', 'green') }
    let(:file) { double(:file, write: true) }
    let(:content) { Faker::Lorem.sentence }
    before do
      allow(LintCI).to receive(:badge_path).and_return('/some/path')
      allow(FileUtils).to receive(:mkdir_p)
      allow(File).to receive(:open) {|&b|  b.call(file) }
      stub_request(:get, subject.shields_url).to_return(body: content)
      subject.download
    end

    it { expect(a_request(:get, subject.shields_url)).to have_been_made.once }
    it { expect(FileUtils).to have_received(:mkdir_p).with('/some/path') }
    it { expect(file).to have_received(:write).with(content) }
  end
end
