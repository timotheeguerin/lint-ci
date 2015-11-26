FactoryGirl.define do
  factory :revision do
    branch
    sha { SecureRandom.hex }
    message { Faker::Lorem.sentence }
    date { DateTime.now }
  end

end
