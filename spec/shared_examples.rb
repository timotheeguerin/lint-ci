require 'set'

RSpec.shared_examples 'Pagination API' do |action|
  let(:record_count) { records.size }
  let(:per_page) { record_count - 1 }

  before do
    get action, {per_page: per_page, page: page}.merge(params)
  end

  context 'when asking for first page' do
    let(:page) { 1 }
    it { expect(response).to return_json }
    it { expect(json_response).to be_a Array }
    it { expect(json_response.size).to eq(per_page) }
    it { expect(json_response.map { |x| x[:id] }).to eq(records[0...per_page].map(&:id)) }
  end

  context 'when asking for second page' do
    let(:page) { 2 }

    it { expect(response).to return_json }
    it { expect(json_response).to be_a Array }
    it { expect(json_response.size).to eq(record_count - per_page) }
    it { expect(json_response.map { |x| x[:id] }).to eq(records[per_page..-1].map(&:id)) }
  end
end

# For 200 response
RSpec.shared_examples 'successful api request' do
  it { expect(response).to be_success }
  it { expect(response).to have_http_status(200) }
  it { expect(response).to return_json }
end

# For 202 response
RSpec.shared_examples 'accepted api request' do
  it { expect(response).to be_success }
  it { expect(response).to have_http_status(202) }
  it { expect(response).to return_json }
end

# For 403 response
RSpec.shared_examples 'forbidden api request' do
  it { expect(response).to be_forbidden }
  it { expect(response).to have_http_status(403) }
  it { expect(response).to return_json }
end
