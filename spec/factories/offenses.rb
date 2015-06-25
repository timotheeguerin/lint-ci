FactoryGirl.define do
  factory :offense do
    association :file, factory: :revision_file

    message { Faker::Lorem.sentence }
    line 1
    column 2
    length 3
    severity :error
  end

end
