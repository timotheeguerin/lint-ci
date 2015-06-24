FactoryGirl.define do
  factory :revision do
    repository
    sha { SecureRandom.hex }
    message { Faker::Lorem.sentence }
    date { Datetime.now }
  end

end
